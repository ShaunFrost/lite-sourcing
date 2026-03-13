import { dbPool } from "../configs/db/mysql"
import { INSERT_SPEC, GET_SPEC_BY_ID } from "../constants/queries"
import { v4 as uuidV4 } from "uuid"
import { SpecRow } from "../types";

export const createSpecInDB = async (projectId: string, name: string, description: string, quantity: number, unitOfMeasure: string) => {
    const uuid = uuidV4();
    const [ results ] = await dbPool.execute(INSERT_SPEC, [uuid, projectId, name, description, quantity, unitOfMeasure])
    console.log("createSpecInDB:", results);
    return {
        id: uuid
    }
}

export const getSpecFromDB = async (specId: string) => {
    const [results] = await dbPool.execute<SpecRow[]>(GET_SPEC_BY_ID, [specId]);
    return results;
}

