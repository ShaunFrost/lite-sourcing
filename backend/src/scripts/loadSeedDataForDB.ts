import { v4 } from "uuid"
import seedData from "./seed.json"
import { indexProduct } from "../utils/vectorOperations"
import mysql from "mysql2/promise"

const dbPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

type ProductT = {
    id: string;
    supplierId: string;
    name: string;
    category: string;
    unitPrice: number;
    currency: string;
    unitOfMeasure: string;
    leadTimeDays: number;
}

const loadVectors = async (products: ProductT[]) => {
    try {
        for (const product of products) {
            await indexProduct(product)
        }
    } catch (error) {
        console.log("Error loading vector data", error)
    }
}

const loadSeedDataForDB = async () => {
    try {
        const suppliers = []
        const products = []
        const productsArray = []
        for (const supplier of seedData) {
            const supplierId = v4();
            suppliers.push([supplierId, supplier.name, supplier.country, supplier.website])
            for (const product of supplier.products) {
                const productId = v4()
                products.push([productId, supplierId, product.product_name, product.category, product.unit_price, product.currency, product.unit_of_measure, product.lead_time_days])
                productsArray.push({
                    id: productId,
                    supplierId: supplierId,
                    name: product.product_name,
                    category: product.category,
                    unitPrice: product.unit_price, 
                    currency: product.currency, 
                    unitOfMeasure: product.unit_of_measure,
                    leadTimeDays: product.lead_time_days
                })
            }
        }

        await dbPool.query("INSERT INTO suppliers(id, name, country, website) VALUES ?", [suppliers])
        await dbPool.query("INSERT INTO products(id, supplier_id, name, category, unit_price, currency, unit_of_measure, lead_time_days) VALUES ?", [products])

        console.log('Mysql tables populated')

        await loadVectors(productsArray)

    } catch (error) {
        console.log("Error loading seed data", error);
    }
}

const main = async () => {
    try {
        await waitForMysql()
        await loadSeedDataForDB();
    } catch (err) {
        console.error(err)
        process.exit(1)
    } finally {
        await dbPool.end()
    }
}

const waitForMysql = async () => {
    let connected = false

    while (!connected) {
        try {
        const conn = await dbPool.getConnection()
        await conn.ping()
        conn.release()
        connected = true
        } catch {
        console.log("Waiting for MySQL...")
        await new Promise(r => setTimeout(r, 2000))
        }
    }
}

main();