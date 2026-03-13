export const env = {
    // main server
    PORT: Number(process.env.PORT) || 3000,
    HOST: process.env.host || "0.0.0.0",

    // mysql server
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: Number(process.env.MYSQL_PORT),
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,

    // qdrant server
    QDRANT_URL: process.env.QDRANT_URL,

    // keys
    OPEN_AI_KEY: process.env.OPEN_AI_KEY
}

// console.log("env: ", env);