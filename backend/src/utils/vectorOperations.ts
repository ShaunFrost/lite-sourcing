import { RowDataPacket } from "mysql2";
import { dbPool } from "../configs/db/mysql";
import { qdrantClient, COLLECTION_NAME, VECTOR_SIZE } from "../configs/vector-db/qdrant";
import { Product } from "../types";
import { generateProductEmbedding } from "./embeddings"

interface ProductRow extends RowDataPacket {
    id: string;
    supplierId: string;
    name: string;
    category: string;
    unitPrice: number;
    currency: string;
    unitOfMeasure: string;
    leadTimeDays: number;
}

export const ensureCollection = async () => {
    const { collections } = await qdrantClient.getCollections();
    const exists = collections.some((c) => c.name === COLLECTION_NAME);

    if (!exists) {
        await qdrantClient.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,
                distance: 'Cosine',
            },
        });
        console.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
    }
}

export const indexProduct = async (product: Product) => {
    const vector = await generateProductEmbedding(product);

    await qdrantClient.upsert(COLLECTION_NAME, {
        wait: true,
        points: [
            {
                id: product.id,
                vector,
                payload: {
                    mysql_id:       product.id,
                    name:           product.name,
                    category:       product.category,
                    unit_price:     product.unitPrice,
                    currency:       product.currency,
                    unit_of_measure: product.unitOfMeasure,
                    lead_time_days: product.leadTimeDays,
                    supplier_id:    product.supplierId,
                },
            },
        ],
    });
}

export const syncAllProducts = async () => {
    try {
        await ensureCollection();

        const [rows] = await dbPool.execute<ProductRow[]>('SELECT * FROM products');
        console.log(`Syncing ${rows.length} products...`);

        for (const product of rows) {
            await indexProduct(product);
        }

        console.log('Sync complete');
    } catch (err) {
        console.log("Error in syncing vector db", err);
    }
}
