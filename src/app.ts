import fastify from "fastify";
import cors from "@fastify/cors";
import router from "./router";

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

// Cors
server.register(cors, {
  // put your options here
  preflightContinue: true,
});

// Middleware: Router
server.register(router);

// Health check
server.register(require("fastify-healthcheck"), {
  healthcheckUrl: "/",
});
export default server;
