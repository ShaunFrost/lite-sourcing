import { COLLECTION_NAME, qdrantClient, VECTOR_SIZE } from "../configs/vector-db/qdrant";

import mysql from "mysql2/promise"

const dbPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

const ensureCollection = async () => {
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

const createTables = async () => {

    try {
        await dbPool.execute(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id            CHAR(36)     NOT NULL,
                name          VARCHAR(255) NOT NULL,
                country       CHAR(2)      NOT NULL,
                website       VARCHAR(500)     NULL,
                created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);

        await dbPool.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id               CHAR(36)        NOT NULL,
                supplier_id      CHAR(36)        NOT NULL,
                name             VARCHAR(255)    NOT NULL,
                category         VARCHAR(100)        NULL,
                unit_price       DECIMAL(10, 2)  NOT NULL,
                currency         VARCHAR(10)     NOT NULL,
                unit_of_measure  VARCHAR(50)     NOT NULL,
                lead_time_days   SMALLINT UNSIGNED NOT NULL,
                created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                CONSTRAINT fk_products_supplier
                    FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
                    ON DELETE RESTRICT
            )
        `);

        await dbPool.execute(`
            CREATE TABLE IF NOT EXISTS projects (
                id          CHAR(36)                                  NOT NULL,
                name        VARCHAR(255)                              NOT NULL,
                client      VARCHAR(255)                              NOT NULL,
                status      ENUM('Draft','Sourcing','Quoted','Closed') NOT NULL DEFAULT 'Draft',
                created_at  DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at  DATETIME                                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);

        await dbPool.execute(`
            CREATE TABLE IF NOT EXISTS spec_items (
                id              CHAR(36)        NOT NULL,
                project_id      CHAR(36)        NOT NULL,
                name            VARCHAR(255)    NOT NULL,
                description     TEXT            NULL,
                quantity        DECIMAL(10, 2)   NOT NULL,
                unit_of_measure VARCHAR(50)     NOT NULL,
                created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                CONSTRAINT fk_spec_items_project
                FOREIGN KEY (project_id) REFERENCES projects(id)
                ON DELETE CASCADE
            )
        `);

        await dbPool.execute(`
            CREATE TABLE IF NOT EXISTS sourcing_data (
                id                CHAR(36)        NOT NULL,
                spec_item_id      CHAR(36)        NOT NULL,
                product_id        CHAR(36)        NOT NULL,
                unit_price        DECIMAL(10,2)   NOT NULL,
                total_cost        DECIMAL(15,2)   NOT NULL,
                lead_time_days    INT             NOT NULL,
                created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                CONSTRAINT fk_sourcing_data_spec_item
                FOREIGN KEY (spec_item_id) REFERENCES spec_items(id)
                ON DELETE CASCADE,
                CONSTRAINT fk_sourcing_product
                FOREIGN KEY (product_id) REFERENCES products(id)
                ON DELETE RESTRICT
            )
        `);
        console.log("Created tables in mysql")
    } catch (error) {
        console.log("Error executing table creation script", error)
    }
}

const main = async () => {
    try {
        await waitForMysql()
        await createTables()
        await ensureCollection()
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
