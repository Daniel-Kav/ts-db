import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";

const result = dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

if (result.error) {
  console.error('Error loading .env file:', result.error);
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    // Add some pool specific configuration
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
})

// the pool will emit an error on behalf of any idle clients
pool.on('error', (err: Error, client: any) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

// Function to execute a query
async function executeQuery(queryText: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const result = await client.query(queryText, params);
        console.log('\nQuery:', queryText);
        console.log('Results:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    } finally {
        client.release();
    }
}

export { pool , executeQuery }