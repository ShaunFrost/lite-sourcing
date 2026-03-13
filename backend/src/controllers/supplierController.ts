import { dbPool } from "../configs/db/mysql"
import { INSERT_SUPPLIER, GET_ALL_SUPPLIERS } from "../constants/queries"
import { v4 as uuidV4 } from "uuid"

export const createSupplierInDB = async (name: string, country: string, website: string) => {
    const uuid = uuidV4();
    const [ results, fields ] = await dbPool.execute(INSERT_SUPPLIER, [uuid, name, country, website])
    console.log("createSupplierInDB:", results, fields);
    return {
        id: uuid
    }
}

export const getAllSuppliersFromDB = async () => {
    const [ results ] = await dbPool.execute(GET_ALL_SUPPLIERS)
    console.log("getProjectsFromDB:", results);
    // throw new Error ("bleh error")
    return results
}
