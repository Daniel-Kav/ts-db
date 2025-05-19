import { client } from './db.config'



(async () => {
  const res = await client.query('SELECT * FROM routes LIMIT 10')
  console.log(res.rows)
  await client.end()
})()
