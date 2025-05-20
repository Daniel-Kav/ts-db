import { pool } from './db.config'



(async () => {
    try {
        // Get a client from the pool
        const client = await pool.connect()
        
        try {
            const res = await client.query('SELECT * FROM routes LIMIT 10')
            console.table(res.rows)
        } finally {
            // Make sure to release the client before any error handling, 
            // just in case the error handling itself throws an error
            client.release()
        }
    } catch (err) {
        console.error('Database query error:', err)
    } finally {
        // Properly close the pool when your app is shutting down
        await pool.end()
    }
})()
