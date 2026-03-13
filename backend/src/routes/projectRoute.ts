import { FastifyInstance, FastifyRequest } from "fastify";
import { getProjectsFromDB, getProjectByIdFromDB, createProjectInDB, getProjectDetails } from "../controllers/projectController"
import { createSourcingInDB } from "../controllers/sourcingController"
import { createSpecInDB } from "../controllers/specsController"
import { searchSpec } from "../controllers/productsController";

type SearchRequest = FastifyRequest<{ Querystring: { term: string } }>

export const projectRoute = async (fastify: FastifyInstance) => {
    
    fastify.get("/", async (request, reply) => {
        try {
            const projects = await getProjectsFromDB();
            return {
                success: true,
                data: projects
            }
        } catch (error) {
            console.error("error getting all projects", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.post("/", async (request, reply) => {
        try {
            console.log("add project", request.body)
            const { name, client } = request.body as any
            const projects = await createProjectInDB(name, client);
            return {
                success: true,
                data: projects
            }
        } catch (error) {
            console.error("error creating project", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.get("/details/:id", async (request, reply) => {
        try {
            const { id } = request.params as any
            const projectDetails = await getProjectDetails(id);
            if (!projectDetails) {
                throw new Error("Couldn't fetch data from DB")
            }
            return {
                success: true,
                data: projectDetails
            }
        } catch (error) {
            console.error("error getting project details", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params as any
            const projects = await getProjectByIdFromDB(id);
            return {
                success: true,
                data: projects
            }
        } catch (error) {
            console.error("error getting all projects", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.post("/spec-item", async (request, reply) => {
        try {
            // console.log("add project", request.body)
            const { projectId, name, description, quantity, unitOfMeasure } = request.body as any
            const spec = await createSpecInDB(projectId, name, description, quantity, unitOfMeasure);
            return {
                success: true,
                data: spec
            }
        } catch (error) {
            console.error("error creating spec", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.get("/source-list/:specId", async (request, reply) => {
        try {
            const { specId }  = request.params as any
            const matchingProducts = await searchSpec(specId);
            return {
                success: true,
                data: matchingProducts
            }
        } catch (error) {
            console.error("error getting matched products", error);
            return {
                success: false,
                data: null
            }
        }
    })

    fastify.post("/sourcing", async (request, reply) => {
        try {
            console.log("add project", request.body)
            const { specItemId, productId, unitPrice, total_cost, lead_time_days } = request.body as any
            const sourcing = await createSourcingInDB(specItemId, productId, unitPrice, total_cost, lead_time_days);
            return {
                success: true,
                data: sourcing
            }
        } catch (error) {
            console.error("error creating sourcing", error);
            return {
                success: false,
                data: null
            }
        }
    })
}
