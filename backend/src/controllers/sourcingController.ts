import { dbPool } from "../configs/db/mysql"
import { INSERT_SOURCING_DATA } from "../constants/queries"
import { v4 as uuidV4 } from "uuid"

export const createSourcingInDB = async (specItemId: string, productId: string, unitPrice: number, totalCost: number, leadTimeDays: number) => {
    const uuid = uuidV4();
    const [ results ] = await dbPool.execute(INSERT_SOURCING_DATA, [uuid, specItemId, productId, unitPrice, totalCost, leadTimeDays])
    console.log("createSourcingInDB:", results);
    return {
        id: uuid
    }
}
