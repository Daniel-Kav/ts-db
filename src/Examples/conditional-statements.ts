import { pool, executeQuery } from '../db.config';

import type {
    CustomerFlight,
    TicketDetail,
    customerGenderNumber,
    avgTicketPrice,
    milesToString
} from './types';


class AirlineQueriesOnConditionals{
  constructor(private readonly pool: any){}

  private async executeQuery<T>(queryText: string, params?:any[]): Promise<T[]>{
    const client = await this.pool.connect();

    try{
      const start =  Date.now();
      const result = await client.query(queryText, params);
      const end = Date.now();
      console.log('\n===Query ===');
      console.log(queryText);
      console.log('\n=== Results ===');

      if(result.rows.length === 0){
        console.log('No results found!');
      }else{
        console.table(result.rows);
      }
      console.log(end-start,"s");
      console.log('===========\n');

      return result.rows as T[];

    }catch(err){
      console.error('Error occured when executing query!');
      throw err;
    }finally{
      client.release();
    }
    
    
  }

  async getMaleAndFemale(limit: number = 10): Promise<CustomerFlight>{
       const simpleCase = `
                SELECT 
                  *,
              CASE 
                  WHEN gender = 'M' THEN 'Male'
                  ELSE 'Female'
                  END AS full_gender
              FROM customer;

            `;

    return (await this.executeQuery<CustomerFlight>(simpleCase))[0];
  }

  async getNumbersOfGenders(){
     const caseWithAgg = ` 
                          SELECT 
                            COUNT(CASE WHEN gender = 'M' THEN 1 END) AS Males,
                            COUNT(CASE WHEN gender = 'F' THEN 1 END) AS Females
                          FROM customer
                        `;
      
        return await this.executeQuery<customerGenderNumber>(caseWithAgg);
  }

  async getPricePerTicket(param: number = 100){
        const coalesce = `
                    SELECT 
                    p_date,
                    customer_id,
                    aircraft_id,
                    class_id,
                    no_of_tickets,
                    a_code,
                    COALESCE(price_per_ticket, $1) AS price_per_ticket,
                    brand
                    FROM 
                    ticket_details
`;

return this.executeQuery<TicketDetail>(coalesce,[param]);
  }


  async getDiffFromAvgPrice(){
    const nullifUseCase = `SELECT 
    p_date,
    customer_id,
    aircraft_id,
    class_id,
    no_of_tickets,
    a_code,
    price_per_ticket,
    brand,
    NULLIF(price_per_ticket, (SELECT AVG(price_per_ticket) FROM ticket_details)) AS price_diff
FROM 
    ticket_details
    `;
    return this.executeQuery<avgTicketPrice>(nullifUseCase);
  }

  async convertMilesToString(){
    const castUseCase =` SELECT 
    route_id,
    flight_num,
    origin_airport,
    destination_airport,
    aircraft_id,
    LPAD(CAST(distance_miles AS VARCHAR(10)), 5, '0') AS distance_miles_str
FROM 
    routes
    `;

    return this.executeQuery<milesToString>(castUseCase);
  }
  
}


async function demonstratingConditionals() {
  try {
    const queries = new AirlineQueriesOnConditionals(pool);

    //1. Simple Case
    console.log('\n=== Male and Femal(Simple Case)===');
    await queries.getMaleAndFemale();

    //2. Case with aggregations
    console.log('\n=== Numbers of Male and Femal(Case with Agg)===');
    await queries.getNumbersOfGenders();

    //3. Coalesce
    console.log('\n=== Price per ticket(Coalesce)===');
    await queries.getPricePerTicket();

    //4. Nullif
    console.log('\n=== Difference from average(Nullif)===');
    await queries.getDiffFromAvgPrice();

    //5. Cast
    console.log('\n=== Convert Miles from numeber to string(Cast)===');
    await queries.convertMilesToString();


 
  }finally {
    await pool.end();
  }
}

demonstratingConditionals().catch(e=>{
  console.error("Error running conditionals: ", e);
  process.exit(-1);
});