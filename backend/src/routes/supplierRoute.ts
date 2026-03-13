import { FastifyInstance } from "fastify";
import { getAllSuppliersFromDB, createSupplierInDB } from "../controllers/supplierController"

export const supplierRoute = async (fastify: FastifyInstance) => {
    
    fastify.get("/", async (request, reply) => {
        try {
            const suppliers = await getAllSuppliersFromDB();
            return {
                success: true,
                data: suppliers
            }
        } catch (error) {
            console.error("error getting all suppliers", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.post("/", async (request, reply) => {
        try {
            const { name, country, website } = request.body as any
            const supplier = await createSupplierInDB(name, country, website);
            return {
                success: true,
                data: supplier
            }
        } catch (error) {
            console.error("error creating supplier", error);
            return {
                success: false,
                data: null
            }
        }
    })
}
