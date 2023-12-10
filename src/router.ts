import { FastifyInstance } from "fastify";
import indexController from "./controller/indexController";
import walletController from "./controller/walletController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(walletController, { prefix: "/wallet" });
  fastify.register(indexController, { prefix: "/index" });
}
