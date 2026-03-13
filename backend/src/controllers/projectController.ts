import { dbPool } from "../configs/db/mysql"
import { INSERT_PROJECT, GET_ALL_PROJECTS, GET_PROJECT_BY_ID, GET_PROJECT_DATA_BY_PROJECT_ID } from "../constants/queries"
import { v4 as uuidV4 } from "uuid"
import { ProjectDetails } from "../types";

export const createProjectInDB = async (name: string, client: string) => {
    const uuid = uuidV4();
    const [ results ] = await dbPool.execute(INSERT_PROJECT, [uuid, name, client, "Draft"])
    console.log("createProjectInDB:", results);
    return {
        id: uuid
    }
}

export const getProjectsFromDB = async () => {
    const [ results ] = await dbPool.execute(GET_ALL_PROJECTS)
    console.log("getProjectsFromDB:", results);
    return results
}

export const getProjectByIdFromDB = async (projectId: string) => {
    const [ results ] = await dbPool.execute(GET_PROJECT_BY_ID, [projectId])
    console.log("getProjectByIdFromDB:", results);
    return results
}

export const getProjectDetailsFromDB = async (projectId: string) => {
    const [results] = await dbPool.execute<ProjectDetails[]>(GET_PROJECT_DATA_BY_PROJECT_ID, [projectId])
    // console.log("getProjectDetailsFromDB:", se);
    return results
}

export const getProjectDetails = async (projectId: string) => {
    try {
        const dbData = await getProjectDetailsFromDB(projectId)
        if (dbData.length === 0) {
            throw new Error("No data found for project");
        }

        console.log("Testing", dbData)

        const suppliers = new Set()
        let maxLeadDays = 0
        let totalCost = 0
        let status = "Draft"
        let sourcedCount = 0;

        const specItems = dbData[0].spec_item_id ? dbData.map(row => {
            let sourcingData = null
            if (row.sourcing_id) {
                sourcedCount += 1;
                if (row.supplier_id) {
                    suppliers.add(row.supplier_id)
                }
                if (maxLeadDays < Number(row.sourcing_lead_time_days)) {
                    maxLeadDays = Number(row.sourcing_lead_time_days)
                }
                if (row.sourcing_total_cost) {
                    totalCost += Number(row.sourcing_total_cost)
                }
                sourcingData = {
                    id: row.sourcing_id,
                    unitPrice: Number(row.sourcing_unit_price),
                    totalCost: Number(row.sourcing_total_cost),
                    leadTimeDays: Number(row.sourcing_lead_time_days),
                    product_id: row.product_id,
                    supplier_id: row.supplier_id
                }
            }
            return {
                id: row.spec_item_id,
                name: row.spec_item_name,
                description: row.spec_item_description,
                quantity: Number(row.spec_item_quantity),
                unitOfMeasure: row.spec_item_uom,
                sourcingData
            }
        }) : []

        if (specItems.length > 0) {
            if (sourcedCount === specItems.length) {
                status = "Quoted"
            } else {
                status = "Sourcing"
            }
        }

        const projectDetails = {
            id: dbData[0].project_id,
            name: dbData[0].project_name,
            client: dbData[0].project_client,
            status: status,
            supplierCount: suppliers.size,
            maxLeadDays: maxLeadDays,
            totalCost: totalCost,
            specItems: specItems
        }
        console.log("outout", projectDetails)
        return projectDetails
    } catch (error) {
        console.error("getProjectDetails: ", error)
        return null
    }
}
