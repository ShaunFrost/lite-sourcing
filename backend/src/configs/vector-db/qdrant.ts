import { QdrantClient } from "@qdrant/js-client-rest"
import { env } from "../env"

export const qdrantClient = new QdrantClient({
    url: env.QDRANT_URL
})

export const COLLECTION_NAME = "products"

export const VECTOR_SIZE = 384;
