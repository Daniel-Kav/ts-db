import { pool } from '../db.config';
import type {
    PassengerFlight,
    Route,
    TicketDetail,
    Customer,
    CustomerRoute,
    FlightComparison
} from './types';



class SetOperationsQueries {
    constructor(private readonly pool: any) {}

    private async executeQuery<T>(queryText: string, params?: any[]): Promise<T[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(queryText, params);
            console.log('\n=== Query ===');
            console.log(queryText);
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

    // 1. UNION: Combine all customers who have either booked a flight or purchased a ticket
    async getAllCustomerBookings(): Promise<CustomerRoute[]> {
        const query = `
            SELECT 
                c.customer_id,
                c.first_name,
                c.last_name,
                pf.flight_num,
                r.origin_airport,
                r.destination_airport
            FROM customer c
            JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            JOIN routes r ON pf.route_id = r.route_id
            WHERE r.origin_airport = 'JFK'
            UNION
            SELECT 
                c.customer_id,
                c.first_name,
                c.last_name,
                pf.flight_num,
                r.origin_airport,
                r.destination_airport
            FROM customer c
            JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            JOIN routes r ON pf.route_id = r.route_id
            WHERE r.destination_airport = 'LAX'
            ORDER BY customer_id
            LIMIT 10`;
        return this.executeQuery<CustomerRoute>(query);
    }

    // 2. UNION ALL: Get all flights (including duplicates) from high-traffic airports
    async getHighTrafficFlights(): Promise<FlightComparison[]> {
        const query = `
            SELECT 
                flight_num,
                origin_airport as origin,
                destination_airport as destination,
                100 as price
            FROM routes
            WHERE origin_airport IN ('JFK', 'LAX', 'ORD')
            UNION ALL
            SELECT 
                flight_num,
                origin_airport,
                destination_airport,
                200 as price
            FROM routes
            WHERE destination_airport IN ('JFK', 'LAX', 'ORD')
            ORDER BY flight_num
            LIMIT 10`;
        return this.executeQuery<FlightComparison>(query);
    }

    // 3. INTERSECT: Find customers who have booked both economy and business class
    async getMultiClassCustomers(): Promise<Partial<Customer>[]> {
        const query = `
            SELECT DISTINCT
                c.customer_id,
                c.first_name,
                c.last_name
            FROM customer c
            JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            WHERE pf.class_id = 'economy'
            INTERSECT
            SELECT DISTINCT
                c.customer_id,
                c.first_name,
                c.last_name
            FROM customer c
            JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            WHERE pf.class_id = 'business'
            ORDER BY customer_id
            LIMIT 10`;
        return this.executeQuery<Partial<Customer>>(query);
    }

    // 4. EXCEPT: Find routes that have flights but no ticket sales
    async getRoutesWithoutTickets(): Promise<Partial<Route>[]> {
        const query = `
            SELECT DISTINCT
                r.route_id,
                r.flight_num,
                r.origin_airport,
                r.destination_airport
            FROM routes r
            EXCEPT
            SELECT DISTINCT
                r.route_id,
                r.flight_num,
                r.origin_airport,
                r.destination_airport
            FROM routes r
            JOIN passengers_on_flights pf ON r.route_id = pf.route_id
            JOIN ticket_details td ON pf.aircraft_id = td.aircraft_id
            ORDER BY flight_num
            LIMIT 10`;
        return this.executeQuery<Partial<Route>>(query);
    }

    // 5. Combined Set Operations: Complex analysis of flight routes
    async getRouteAnalysis(): Promise<FlightComparison[]> {
        const query = `
            -- High-priced routes from major airports
            SELECT 
                r.flight_num,
                r.origin_airport as origin,
                r.destination_airport as destination,
                td.price_per_ticket as price
            FROM routes r
            JOIN passengers_on_flights pf ON r.route_id = pf.route_id
            JOIN ticket_details td ON pf.aircraft_id = td.aircraft_id
            WHERE td.price_per_ticket > 500
            INTERSECT
            -- Routes between major airports
            SELECT 
                flight_num,
                origin_airport,
                destination_airport,
                0 as price
            FROM routes
            WHERE origin_airport IN ('JFK', 'LAX', 'ORD')
            AND destination_airport IN ('JFK', 'LAX', 'ORD')
            ORDER BY flight_num
            LIMIT 10`;
        return this.executeQuery<FlightComparison>(query);
    }
}

async function demonstrateSetOperations() {
    const queries = new SetOperationsQueries(pool);
    
    try {
        // 1. UNION Example
        console.log('\n=== Customers with JFK or LAX Flights (UNION) ===');
        await queries.getAllCustomerBookings();

        // 2. UNION ALL Example
        console.log('\n=== High Traffic Flights (UNION ALL) ===');
        await queries.getHighTrafficFlights();

        // 3. INTERSECT Example
        console.log('\n=== Multi-Class Customers (INTERSECT) ===');
        await queries.getMultiClassCustomers();

        // 4. EXCEPT Example
        console.log('\n=== Routes Without Ticket Sales (EXCEPT) ===');
        await queries.getRoutesWithoutTickets();

        // 5. Combined Set Operations Example
        console.log('\n=== Premium Major Route Analysis (Combined) ===');
        await queries.getRouteAnalysis();

    } finally {
        await pool.end();
    }
}

// Run the demonstrations
demonstrateSetOperations().catch(err => {
    console.error('Error in set operations demonstrations:', err);
    process.exit(1);
});
