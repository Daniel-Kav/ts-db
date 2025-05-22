import { pool } from '../db.config';

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


  
}
