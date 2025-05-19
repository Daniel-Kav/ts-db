const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'airlines',
    password: 'django1234',
    port: 5432,
  })

;(async () => {
  await client.connect()
  // your code here
})()

export {}