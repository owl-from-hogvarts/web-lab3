import Fastify from "fastify";
import { fastifyStatic } from "@fastify/static";
import * as path from "node:path";

const fastify = Fastify()



fastify.register(fastifyStatic, {
  root: path.resolve("."),
})

fastify.listen({
  port: 8080
})

