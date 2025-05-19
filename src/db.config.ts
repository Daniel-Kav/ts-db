const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'django1234',
    port: 5432,
  })

;(async () => {
  await client.connect()
})()

export { client }