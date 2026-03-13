import { FastifyInstance } from "fastify";
import { createProductInDB, getAllProductsForSupplierFromDB } from "../controllers/productsController"

export const productsRoute = async (fastify: FastifyInstance) => {
    
    fastify.get("/:supplierId", async (request, reply) => {
        try {
            const { supplierId } = request.params as any
            const products = await getAllProductsForSupplierFromDB(supplierId);
            return {
                success: true,
                data: products
            }
        } catch (error) {
            console.error("error getting all products", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.post("/", async (request, reply) => {
        try {
            const { supplierId, name, category, unitPrice, currency, unitOfMeasure, leadTimeDays } = request.body as any
            const product = await createProductInDB(supplierId, name, category, unitPrice, currency, unitOfMeasure, leadTimeDays);
            return {
                success: true,
                data: product
            }
        } catch (error) {
            console.error("error creating product", error);
            return {
                success: false,
                data: null
            }
        }
    })
}
