//In this we are just demonstrating how contraints can be run in code
// If you want to see this code in action, you can drop all the primary and foreign key constraints first
//then run this code, other wise, PostgreSQL will throw and error since our DDL had already put these contraints during creation


import { pool } from '../db.config';
import { CustomerFlight, PassengerFlight } from './types';

class AirlinesQueriesOnConstraints {
  constructor(private readonly pool: any) {}

  private async executeQuery<T>(
    queryText: string,
    param?: any[]
  ): Promise<T[]> {
    const client = await this.pool.connect();

    try {
      const start = Date.now();
      const result = await client.query(queryText, param);
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


  async makeUnique(){
    const uniqueConstraint =
    ` ALTER TABLE customer
ADD CONSTRAINT pk_customer_id PRIMARY KEY(customer_id)
`;

    return await this.executeQuery<CustomerFlight>(uniqueConstraint);

  }

  async ensureValidRoute(){
    const foreignKeyDemo = 
            `
            ALTER TABLE passengers_on_flights
ADD CONSTRAINT fk_route_id FOREIGN KEY (route_id) REFERENCES routes(route_id);
            `;
          
      return await this.executeQuery<PassengerFlight>(foreignKeyDemo);
  }

  async ensureDate(){
    const checkWithDemo = 
     `
    ALTER TABLE passengers_on_flights
ADD CONSTRAINT fk_route_id FOREIGN KEY (route_id) REFERENCES routes(route_id)
 `;

 return await this.executeQuery<PassengerFlight>(checkWithDemo);
  }

  async ensureNames(){
    const demoConstraint =
           `
            ALTER TABLE customer
ADD CONSTRAINT uk_first_name_last_name UNIQUE (first_name, last_name);
            `;

            return await this.executeQuery<CustomerFlight>(demoConstraint);
  }
}

async function demonstrateConstraints(){
  try{

    const queries = new AirlinesQueriesOnConstraints(pool);


    //1. Primary Key constraints
    console.log('\n=== Check column id is unique (Primary Key constraint)===');
    await queries.makeUnique();

    //2. Foreign key constraint
    console.log('\n=== Ensure valid route(Foreign key constraint)===');
    await queries.ensureValidRoute();

    //3. Check constraints
    console.log('\n=== Ensure dates are form the past(Check constraint)===');
    await queries.ensureDate();

    //4. Unique Constraint
    console.log('\n===Ensure combination of first and last name are unique (Unique constraint)====');
    await queries.ensureNames();

  }finally{
      pool.end();
  }
}

demonstrateConstraints().catch(e=>{
  console.log('Error:',e);
  process.exit(-1);
});