import { FastifyInstance } from "fastify";
import userController from "./controller/userController";
import indexController from "./controller/indexController";
import walletController from "./controller/walletController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(userController, { prefix: "/api/v1/user" });
  fastify.register(walletController, { prefix: "/wallet" })
  fastify.register(indexController, { prefix: "/" });
}
