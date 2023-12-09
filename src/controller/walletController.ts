import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { CoinGeckoId, SupportedNetworks, coingeckoUrl } from "../constants";
import "dotenv/config";
import { FetchPrice } from "../constants/interfaces";
import { BigNumber, utils } from "ethers";

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
}
