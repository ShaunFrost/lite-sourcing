import dotenv from "dotenv"
dotenv.config()
import cors from "@fastify/cors"
import { env } from "./configs/env"
import Fastify from "fastify"
import { projectRoute } from "./routes/projectRoute";
import { supplierRoute } from "./routes/supplierRoute";
import { productsRoute } from "./routes/productsRoute";
import { loadSeedData } from "./scripts/loadSeedData"
import { syncAllProducts } from "./utils/vectorOperations"

const fastify = Fastify();

fastify.register(cors, {
    origin: "*",
});

fastify.register(projectRoute, { prefix: "/project" })
fastify.register(supplierRoute, { prefix: "/supplier" })
fastify.register(productsRoute, { prefix: "/products" })

fastify.get("/ping", async function handler(request, reply) {
    return { pong: "true" };
});

fastify.post("/load-seed", async function handler(request, reply) {
    await loadSeedData();
    return { loaded: true }
})

fastify.post("/load-vectors", async function handler(request, reply) {
    await syncAllProducts();
    return { loaded: true }
});

const startServer = async () => {
    try {
        await fastify.listen({
            port: env.PORT,
            host: env.HOST
        });
        console.log(`Serevr running on port ${env.PORT}`);
    } catch (err) {
        console.error("Error starting server", err);
    }
}

startServer();

process.on("SIGINT", async () => {
    await fastify.close();
    process.exit(0);
});
