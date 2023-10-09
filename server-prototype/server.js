"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var static_1 = require("@fastify/static");
var path = require("node:path");
var fastify = (0, fastify_1.default)();
fastify.register(static_1.fastifyStatic, {
    root: path.resolve("."),
});
fastify.listen({
    port: 8080
});
