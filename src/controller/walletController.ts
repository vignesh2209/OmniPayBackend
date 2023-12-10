import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from 'axios';
import { Wallet, ethers, providers } from "ethers";
import { BigNumber, utils } from "ethers";
import { arrayify, defaultAbiCoder, hexConcat } from "ethers/lib/utils";
import { CoinGeckoId, PaymasterAddresses, SupportedNetworks, bundlerUrls, coingeckoUrl, PaymasterAbi } from "../constants";
import { FetchPrice } from "../constants/interfaces";
import 'dotenv/config'

export default async function walletController(fastify: FastifyInstance) {
	// POST /api/v1/wallet
	fastify.post(
		"/fetch_price",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				const { chainId, userOp } = request.body as FetchPrice;
				if (!chainId || !userOp) reply.code(400).send("Invalid Body");
				const coingeckoChainId = CoinGeckoId[chainId];
				if (!coingeckoChainId)
					reply.code(400).send({ error: true, message: "Chain not supported" });
				const response = await axios.get(
					`${coingeckoUrl}&ids=${coingeckoChainId}&x_cg_demo_api_key=${process.env.CoinGeckoApiKey}`
				);
				const priceData = response.data;
				console.log("priceData: ", priceData);
				if (!priceData[coingeckoChainId])
					reply
						.code(400)
						.send({ error: true, message: "Something went wrong" });

				const txnGasAmount = BigNumber.from(userOp.callGasLimit)
					.add(BigNumber.from(userOp.preVerificationGas))
					.add(
						BigNumber.from(userOp.verificationGasLimit).mul(
							BigNumber.from(userOp.maxFeePerGas)
						)
					);
				const etherAmount = utils.formatUnits(txnGasAmount, "ether");
				console.log("etherAmount", etherAmount);

				const usdAmount = priceData[coingeckoChainId].usd * Number(etherAmount);
				console.log("usdAmount", usdAmount);
				reply.code(200).send({ error: false, usdAmount: usdAmount });
			} catch (err) {
				console.log(err);
				reply.code(400).send("something went wrong");
			}
		}
	);

	fastify.post(
		"/receiverAddress",
		async function (request: FastifyRequest, reply: FastifyReply) {
			const body: any = request.body;
			if (!body) reply.code(400).send("Body not found");
			if (!body.chainId) reply.code(400).send("Invalid Body");
			const chainId = body.chainId;
			if (!SupportedNetworks.includes(chainId))
				reply.code(400).send("Unsupported ChainId");
			reply.code(200).send({ error: false, address: process.env.FeeCollector });
		}
	);

	fastify.post("/generatePaymasterAndData", async function (
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		try {
			const body: any = JSON.parse(request.body as string);
			if (!body)
				reply.code(400).send({ error: true, message: 'Body not found' })
			if (!body.chainId || !body.userOp)
				reply.code(400).send({ error: true, message: 'Invalid Body' })
			const bundlerRpc = bundlerUrls[body.chainId];
			console.log(body.userOp);
			const provider = new providers.JsonRpcProvider(bundlerRpc);
			console.log('Paymaster Address: ', PaymasterAddresses[body.chainId]);
			const paymasterContract = new ethers.Contract(PaymasterAddresses[body.chainId], PaymasterAbi.default, provider);
			const date = new Date();
			const hex = (Number((date.valueOf() / 1000).toFixed(0)) + 600).toString(16);
			const hex1 = (Number((date.valueOf() / 1000).toFixed(0))).toString(16);
			let validAfter = '0x'
			let validUntil = '0x'
			for (let i = 0; i < 14 - hex.length; i++) {
				validUntil += '0';
			}
			for (let i = 0; i < 14 - hex1.length; i++) {
				validAfter += '0';
			}
			validUntil += hex;
			validAfter += hex1;

			if (!process.env.PaymasterWallet) reply.code(400).send('No Wallet added to env');
			const signer = new Wallet(process.env.PaymasterWallet as string, provider)
			const hash = await paymasterContract.getHash(
				body.userOp,
				validUntil,
				validAfter
			);

			const sig = await signer.signMessage(arrayify(hash));

			const paymasterAndData = hexConcat([
				paymasterContract.address,
				defaultAbiCoder.encode(
					['uint48', 'uint48'],
					[validUntil, validAfter]
				),
				sig,
			]);

			reply.code(200).send({ error: false, paymasterAndData })
		} catch (err) {
			console.log('err: ', err);
			reply.code(400).send({ error: true, message: 'Something went wrong' })
		}
	});
}
