import { dbPool } from "../configs/db/mysql"
import { INSERT_PRODUCT, GET_PRODUCTS_FOR_SUPPLIER, GET_PRODUCT_BY_ID } from "../constants/queries"
import { v4 as uuidV4 } from "uuid"
import { indexProduct } from "../utils/vectorOperations"
import { Product, ProductRow } from "../types"
import { generateProductEmbedding } from "../utils/embeddings"
import { COLLECTION_NAME, qdrantClient } from "../configs/vector-db/qdrant"
import { getSpecFromDB } from "./specsController"

export const createProductInDB = async (supplierId: string, name: string, category: string, unitPrice: number, currency: string, unitOfMeasure: string, leadTimeDays: number) => {
    const uuid = uuidV4();
    const [ results ] = await dbPool.execute(INSERT_PRODUCT, [uuid, supplierId, name, category, unitPrice, currency, unitOfMeasure, leadTimeDays])
    console.log("createProductInDB:", results);
    try {
        const [results] = await dbPool.execute<ProductRow[]>(GET_PRODUCT_BY_ID, [uuid]);
        // console.log("product", results)
        await indexProduct({
            id: results[0].id,
            supplierId: results[0].supplier_id,
            name: results[0].name,
            category: results[0].category,
            unitPrice: Number(results[0].unit_price),
            currency: results[0].currency,
            unitOfMeasure: results[0].unit_of_measure,
            leadTimeDays: Number(results[0].lead_time_days)
        })
    } catch (error) {
        console.log("Error indexing product in vector db", error)
    }
    return {
        id: uuid,
        supplier_id: supplierId
    }
}

export const getAllProductsForSupplierFromDB = async (supplierId: string) => {
    const [ results ] = await dbPool.execute(GET_PRODUCTS_FOR_SUPPLIER, [supplierId])
    console.log("getAllProductsForSupplierFromDB:", results);
    return results
}

export const searchSpec = async (specId: string) => {
    try {

        const specData = await getSpecFromDB(specId);

        if (!specData || specData.length === 0) return [];

        const queryVector = await generateProductEmbedding({ name: specData[0].name, unitOfMeasure: specData[0].unit_of_measure } as Product)

        const searchParams = {
            vector: queryVector,
            limit: 3,
            with_payload: true,
            score_threshold: 0.5,
        };

        const results = await qdrantClient.search(COLLECTION_NAME, searchParams);

        if (!results.length) return [];

        console.log("results", results);

        const productIds = results.map(result => result.id)
        const placeholders = productIds.map(() => '?').join(',');

        const [dbResults] = await dbPool.query<ProductRow[]>(`SELECT p.*, s.name AS supplier_name, s.country AS supplier_country
            FROM products p
            LEFT JOIN suppliers s ON s.id = p.supplier_id
            WHERE p.id IN (${placeholders})`,
            productIds
        )

        console.log("dbresults", dbResults)

        const finalData = results.map(vectorRow => {
            const productData = dbResults.find(productRow => productRow.id === vectorRow.id)
            if (productData !== undefined) {
                return {
                    score: vectorRow.score,
                    product: productData
                }
            } else {
                return null
            }
        })

        const filteredRankedData = finalData.filter(data => data !== null)

        return filteredRankedData

    } catch (error) {
        console.error("Error in fetching sourcing options", error)
        return []
    }
}