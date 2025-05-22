import { pool } from '../db.config';
import { CustomerFlight, PassengerFlight, Route, TicketDetail } from './types';

class AirlinesQueriesOnTransactions {
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

  async updateCustomer() {
    const updateQuery = `
      UPDATE customer
      SET first_name = 'John', last_name = 'Doe'
      WHERE customer_id = 1;
    `;

    return await this.executeQuery<CustomerFlight> (updateQuery);
  }

  async insertRoute() {
    const insertQuery = `
      INSERT INTO routes (route_id, flight_num, origin_airport, destination_airport, aircraft_id, distance_miles)
      VALUES (1, 'AA123', 'JFK', 'LAX', 'A1', 2500);
    `;

    return await this.executeQuery<Route>(insertQuery);
  }

  async updateTicketDetails() {
    const updateQuery = `
      UPDATE ticket_details
      SET price_per_ticket = 100.00
      WHERE customer_id = 1;
    `;

    return await this.executeQuery<TicketDetail>(updateQuery);
  }

  async deletePassengerOnFlight() {
    const deleteQuery = `
      DELETE FROM passengers_on_flights
      WHERE customer_id = 1;
    `;

    return await this.executeQuery<PassengerFlight>(deleteQuery);
  }

}


async function demonstrateTransactions() {
  try {
    const queries = new AirlinesQueriesOnTransactions(pool);

    // Begin a transaction
    const startTransactionQuery = `
      BEGIN;
    `;

    await pool.query(startTransactionQuery);

    try {
      // Update customer
      console.log('\n=== Update customer ===');
      await queries.updateCustomer();

      // Insert route
      console.log('\n=== Insert route ===');
      await queries.insertRoute();

      // Update ticket details
      console.log('\n=== Update ticket details ===');
      await queries.updateTicketDetails();

      // Delete passenger on flight
      console.log('\n=== Delete passenger on flight ===');
      await queries.deletePassengerOnFlight();
    } catch (error) {
      // Rollback the transaction if any of the queries fail
      const rollbackQuery = `
        ROLLBACK;
      `;

      await pool.query(rollbackQuery);
      console.error('Transaction rolled back due to error:', error);
    }

    // Commit the transaction if all queries succeed
    const commitQuery = `
      COMMIT;
    `;

    await pool.query(commitQuery);
    console.log('Transaction committed successfully.');
  } finally {
    pool.end();
  }
}

demonstrateTransactions();