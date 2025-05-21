import { pool } from '../db.config';
import type {
    Customer,
    PassengerFlight,
    TicketDetail,
    Route
} from './types';

class DataModificationQueries {
    constructor(private readonly pool: any) {}

    private async executeQuery<T>(queryText: string, params?: any[]): Promise<T[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryText, params);
            console.log('\n=== Query ===');
            console.log(queryText);
            if (params) {
                console.log('Parameters:', params);
            }
            console.log('\n=== Results ===');
            if (result.rows.length === 0) {
                console.log('No results found');
            } else {
                console.table(result.rows);
            }
            console.log('=============\n');
            return result.rows as T[];
        } catch (err) {
            console.error('Error executing query:', err);
            throw err;
        } finally {
            client.release();
        }
    }

    // Add utility function to reset sequences
    async resetSequence(tableName: string, idColumn: string): Promise<void> {
        const client = await this.pool.connect();
        try {
            // Get current max ID
            const maxIdResult = await client.query(
                `SELECT COALESCE(MAX(${idColumn}), 0) as max_id FROM ${tableName}`
            );
            const maxId = maxIdResult.rows[0].max_id;
            
            // Reset sequence to start after max ID
            await client.query(`
                SELECT setval(
                    pg_get_serial_sequence('${tableName}', '${idColumn}'),
                    $1,
                    true
                )`, [maxId]);
            
            console.log(`Reset ${tableName}.${idColumn} sequence to start after ${maxId}`);
        } finally {
            client.release();
        }
    }

    // 1. Single Row Insert
    async insertCustomer(customer: { 
        first_name: string, 
        last_name: string, 
        date_of_birth: string, 
        gender: string 
    }): Promise<Customer> {
        const query = `
            INSERT INTO customer (
                first_name,
                last_name,
                date_of_birth,
                gender
            ) VALUES ($1, $2, $3, $4)
            RETURNING *`;
        
        const result = await this.executeQuery<Customer>(query, [
            customer.first_name,
            customer.last_name,
            customer.date_of_birth,
            customer.gender
        ]);
        return result[0];
    }

    // 2. Multiple Rows Insert
    async insertMultipleTickets(tickets: Array<{
        p_date: string,
        customer_id: number,
        aircraft_id: string,
        class_id: string,
        no_of_tickets: number,
        a_code: string,
        price_per_ticket: number,
        brand: string
    }>): Promise<TicketDetail[]> {
        const values = tickets.map((_, index) => 
            `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${index * 8 + 4}, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${index * 8 + 8})`
        ).join(',');
        
        const params = tickets.flatMap(t => [
            t.p_date,
            t.customer_id,
            t.aircraft_id,
            t.class_id,
            t.no_of_tickets,
            t.a_code,
            t.price_per_ticket,
            t.brand
        ]);

        const query = `
            INSERT INTO ticket_details (
                p_date,
                customer_id,
                aircraft_id,
                class_id,
                no_of_tickets,
                a_code,
                price_per_ticket,
                brand
            ) VALUES ${values}
            RETURNING *`;

        return this.executeQuery<TicketDetail>(query, params);
    }

    // 3. Update Single Row
    async updateTicketPrice(customerId: number, newPrice: number): Promise<TicketDetail> {
        const query = `
            UPDATE ticket_details
            SET price_per_ticket = $2
            WHERE customer_id = $1
            RETURNING *`;
        
        const result = await this.executeQuery<TicketDetail>(query, [customerId, newPrice]);
        return result[0];
    }

    // 4. Update with JOIN
    async updateTicketPricesBasedOnDistance(minDistance: number, priceIncrease: number): Promise<any[]> {
        const query = `
            UPDATE ticket_details td
            SET price_per_ticket = td.price_per_ticket + $2
            FROM routes r
            JOIN passengers_on_flights pf ON r.route_id = pf.route_id
            WHERE td.aircraft_id = pf.aircraft_id
            AND r.distance_miles > $1
            RETURNING td.customer_id, td.price_per_ticket, r.distance_miles`;
        
        return this.executeQuery(query, [minDistance, priceIncrease]);
    }

    // 5. Delete Data
    async deleteExpiredTickets(date: string): Promise<any[]> {
        const query = `
            DELETE FROM ticket_details
            WHERE p_date < $1
            RETURNING *`;
        
        return this.executeQuery(query, [date]);
    }

    // 6. Upsert (INSERT ... ON CONFLICT)
    async upsertRoute(route: Omit<Route, 'route_id'>): Promise<Route> {
        const query = `
            INSERT INTO routes (
                flight_num,
                origin_airport,
                destination_airport,
                aircraft_id,
                distance_miles
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        
        const result = await this.executeQuery<Route>(query, [
            route.flight_num,
            route.origin_airport,
            route.destination_airport,
            route.aircraft_id,
            route.distance_miles
        ]);
        return result[0];
    }

    // 7. Conditional Update
    async updateCustomerClass(customerId: number, flightNum: string, newClass: string): Promise<PassengerFlight> {
        const query = `
            UPDATE passengers_on_flights
            SET class_id = $3
            WHERE customer_id = $1 AND flight_num = $2
            AND class_id != $3  -- Only update if class is different
            RETURNING *`;
        
        const result = await this.executeQuery<PassengerFlight>(query, [customerId, flightNum, newClass]);
        return result[0];
    }

    // 8. Bulk Delete with Join
    async deleteCancelledFlights(): Promise<any[]> {
        const query = `
            DELETE FROM passengers_on_flights pf
            USING routes r
            WHERE pf.route_id = r.route_id
            AND r.origin_airport = r.destination_airport  -- Cancelled flights
            RETURNING pf.*, r.origin_airport, r.destination_airport`;
        
        return this.executeQuery(query);
    }
}

async function demonstrateDataModification() {
    const queries = new DataModificationQueries(pool);
    
    try {
        // Reset sequences before starting
        await queries.resetSequence('customer', 'customer_id');
        await queries.resetSequence('routes', 'route_id');

        // 1. Insert Single Customer
        console.log('\n=== Insert Single Customer ===');
        const newCustomer = await queries.insertCustomer({
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1990-01-01',
            gender: 'M'
        });

        // 2. Insert Multiple Tickets
        console.log('\n=== Insert Multiple Tickets ===');
        const newTickets = await queries.insertMultipleTickets([
            {
                p_date: '2025-05-21',
                customer_id: newCustomer.customer_id,
                aircraft_id: 'A123',
                class_id: 'economy',
                no_of_tickets: 2,
                a_code: 'JFK',
                price_per_ticket: 300,
                brand: 'ExampleAir'
            },
            {
                p_date: '2025-05-21',
                customer_id: newCustomer.customer_id,
                aircraft_id: 'B456',
                class_id: 'business',
                no_of_tickets: 1,
                a_code: 'LAX',
                price_per_ticket: 800,
                brand: 'ExampleAir'
            }
        ]);

        // 3. Update Ticket Price
        console.log('\n=== Update Ticket Price ===');
        await queries.updateTicketPrice(newCustomer.customer_id, 350);

        // 4. Update Prices Based on Distance
        console.log('\n=== Update Prices for Long Distance Flights ===');
        await queries.updateTicketPricesBasedOnDistance(1000, 50);

        // 5. Delete Expired Tickets
        console.log('\n=== Delete Expired Tickets ===');
        await queries.deleteExpiredTickets('2025-04-21');  // One month ago

        // 6. Upsert Route
        console.log('\n=== Upsert Route ===');
        await queries.upsertRoute({
            flight_num: 'FL999',
            origin_airport: 'JFK',
            destination_airport: 'LAX',
            aircraft_id: 'A123',
            distance_miles: 2475
        });

        // 7. Conditional Update
        console.log('\n=== Conditional Update - Upgrade Class ===');
        await queries.updateCustomerClass(newCustomer.customer_id, 'FL999', 'business');

        // 8. Bulk Delete
        console.log('\n=== Delete Cancelled Flights ===');
        await queries.deleteCancelledFlights();

    } finally {
        await pool.end();
    }
}

// Run the demonstrations
demonstrateDataModification().catch(err => {
    console.error('Error in data modification demonstrations:', err);
    process.exit(1);
});
