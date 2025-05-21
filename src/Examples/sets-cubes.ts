import { pool} from '../db.config';

import type {

  PassengerFlight,
  cubeExampleType,
} from './types';

class AirlineQueriesOnSetsCubes {
  constructor(private readonly pool: any) {}

  private async executeQuery<T>(
    queryText: string,
    params?: any[]
  ): Promise<T[]> {
    const client = await this.pool.connect();

    try {
      const start = Date.now();
      const result = await client.query(queryText, params);
      const end = Date.now();
      console.log('\n===Query ===');
      console.log(queryText);
      console.log('\n=== Results ===');

      if (result.rows.length === 0) {
        console.log('No results found!');
      } else {
        console.table(result.rows);
      }
      console.log(end - start, 's');
      console.log('===========\n');

      return result.rows as T[];
    } catch (err) {
      console.error('Error occured when executing query!');
      throw err;
    } finally {
      client.release();
    }
  }

  async ticketsSoldUsingGroupSets(limit: number = 10) {
    const groupingSetsUseCase = `
               SELECT 
    customer_id,
    aircraft_id,
    route_id,
    COUNT(*) AS total_records
FROM 
    passengers_on_flights
GROUP BY 
    GROUPING SETS (
        (customer_id),
        (aircraft_id),
        (route_id),
        ()
    )`;
    return this.executeQuery<PassengerFlight>(groupingSetsUseCase);
  }

  async ticketsSoldUsingCubes() {
    const cubeUseCase = ` 
                          SELECT 
    customer_id,
    aircraft_id,
    route_id,
    COUNT(*) AS total_records
FROM 
    passengers_on_flights
GROUP BY 
    CUBE (customer_id, aircraft_id, route_id)
                        `;

    return await this.executeQuery<cubeExampleType>(cubeUseCase);
  }

  async ticketsSoldUsingRollup() {
    const rollupUseCase = `
                    SELECT 
    customer_id,
    aircraft_id,
    route_id,
    COUNT(*) AS total_records
FROM 
    passengers_on_flights
GROUP BY 
    ROLLUP (customer_id, aircraft_id, route_id)
`;

    return this.executeQuery<cubeExampleType>(rollupUseCase);
  }
}

async function demonstrateSetAndCubes() {
  try {
    const queries = new AirlineQueriesOnSetsCubes(pool);

    //1. Grouping sets
    console.log('\n=== Total tickets sold (Grouping sets)===');
    await queries.ticketsSoldUsingGroupSets();

    //2. Cubes
    console.log('\n=== Total tickets sold(Cubes)===');
    await queries.ticketsSoldUsingCubes();

    //3. rollup
    console.log('\n=== Total tickets sold(Rollup)===');
    await queries.ticketsSoldUsingRollup();
  } finally {
    pool.end();
  }
}

demonstrateSetAndCubes().catch((e) => {
  console.log('Error:', e);
  process.exit(-1);
});
