import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from 'axios';
import { CoinGeckoId, Markup, SupportedNetworks, coingeckoUrl } from "../constants";
import 'dotenv/config'

export default async function walletController(fastify: FastifyInstance) {
	// POST /api/v1/wallet
	fastify.post("/fetch_price", async function (
		request: FastifyRequest,
		reply: FastifyReply
	) {
		try {
			const body: any = request.body;
			if (!body)
				reply.code(400).send('Body not found')
			if (!body.chainId || !body.amount)
				reply.code(400).send('Invalid Body')
			const coingeckoChainId = CoinGeckoId[body.chainId];
			if (!coingeckoChainId) reply.code(400).send({ error: true, message: 'Chain not supported' })
			const response = await axios.get(`${coingeckoUrl}&ids=${coingeckoChainId}&x_cg_demo_api_key=${process.env.CoinGeckoApiKey}`);
			const priceData = response.data;
			console.log('priceData: ', priceData)
			if (!priceData[coingeckoChainId]) reply.code(400).send({ error: true, message: 'Something went wrong' })
			let usdAmount = priceData[coingeckoChainId].usd * body.amount;
			usdAmount += usdAmount * Markup[body.chainId];
			reply.code(200).send({ error: false, usdAmount });
		} catch (err) {
			console.log(err);
			reply.code(400).send('something went wrong')
		}
	});

	fastify.post("/receiverAddress", async function (
		request: FastifyRequest,
		reply: FastifyReply,
	) {
		const body: any = request.body;
		if (!body)
			reply.code(400).send('Body not found')
		if (!body.chainId)
			reply.code(400).send('Invalid Body')
		const chainId = body.chainId;
		if (!SupportedNetworks.includes(chainId))
			reply.code(400).send('Unsupported ChainId')
		reply.code(200).send({error: false, address: process.env.FeeCollector})
	});
}
