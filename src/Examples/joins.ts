import { pool } from '../db.config';
import type {
    PassengerDetail,
    CustomerFlight,
    ComprehensiveFlight,
    SameDistanceRoute,
    RouteTicket,
    PassengerFlight,
    TicketDetail
} from './types';

class AirlineQueries {
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

    async getPassengerDetails(limit: number = 5): Promise<PassengerDetail[]> {
        const query = `
            SELECT 
                pf.flight_num,
                c.first_name,
                c.last_name,
                pf.seat_num,
                pf.travel_date
            FROM passengers_on_flights pf
            INNER JOIN customer c ON pf.customer_id = c.customer_id
            LIMIT $1`;
        return this.executeQuery<PassengerDetail>(query, [limit]);
    }

    async getCustomersWithFlights(limit: number = 5): Promise<CustomerFlight[]> {
        const query = `
            SELECT 
                c.customer_id,
                c.first_name,
                c.last_name,
                pf.flight_num,
                pf.travel_date
            FROM customer c
            LEFT JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            LIMIT $1`;
        return this.executeQuery<CustomerFlight>(query, [limit]);
    }

    async getComprehensiveFlightInfo(limit: number = 5): Promise<ComprehensiveFlight[]> {
        const query = `
            SELECT 
                c.first_name,
                c.last_name,
                pf.flight_num,
                r.origin_airport,
                r.destination_airport,
                td.price_per_ticket,
                td.brand
            FROM passengers_on_flights pf
            INNER JOIN customer c ON pf.customer_id = c.customer_id
            INNER JOIN routes r ON pf.route_id = r.route_id
            INNER JOIN ticket_details td ON pf.aircraft_id = td.aircraft_id
            LIMIT $1`;
        return this.executeQuery<ComprehensiveFlight>(query, [limit]);
    }

    async getRoutesWithSameDistance(limit: number = 5): Promise<SameDistanceRoute[]> {
        const query = `
            SELECT 
                r1.flight_num as flight1,
                r2.flight_num as flight2,
                r1.distance_miles
            FROM routes r1
            INNER JOIN routes r2 ON 
                r1.distance_miles = r2.distance_miles AND
                r1.flight_num < r2.flight_num
            LIMIT $1`;
        return this.executeQuery<SameDistanceRoute>(query, [limit]);
    }

    async getRoutesAndTickets(limit: number = 5): Promise<RouteTicket[]> {
        const query = `
            SELECT 
                r.flight_num,
                r.origin_airport,
                r.destination_airport,
                td.brand,
                td.price_per_ticket
            FROM routes r
            FULL OUTER JOIN ticket_details td ON r.aircraft_id = td.aircraft_id
            LIMIT $1`;
        return this.executeQuery<RouteTicket>(query, [limit]);
    }

    async getAllRouteAircraftCombinations(limit: number = 5): Promise<RouteTicket[]> {
        const query = `
            SELECT DISTINCT 
                r.flight_num,
                td.brand,
                r.origin_airport,
                r.destination_airport
            FROM routes r
            CROSS JOIN ticket_details td
            LIMIT $1`;
        return this.executeQuery<RouteTicket>(query, [limit]);
    }

    async getCommonTickets(limit: number = 5): Promise<Partial<PassengerFlight & TicketDetail>[]> {
        const query = `
            SELECT 
                customer_id,
                aircraft_id,
                class_id
            FROM passengers_on_flights
            NATURAL JOIN ticket_details
            LIMIT $1`;
        return this.executeQuery(query, [limit]);
    }

    async getComplexFlightInfo(minPrice: number = 100, limit: number = 5): Promise<ComprehensiveFlight[]> {
        const query = `
            SELECT 
                c.first_name,
                c.last_name,
                pf.flight_num,
                td.brand,
                td.price_per_ticket,
                r.origin_airport,
                r.destination_airport
            FROM passengers_on_flights pf
            INNER JOIN customer c ON pf.customer_id = c.customer_id
            INNER JOIN ticket_details td 
                ON pf.aircraft_id = td.aircraft_id 
                AND pf.class_id = td.class_id
            INNER JOIN routes r 
                ON pf.route_id = r.route_id 
                AND pf.flight_num = r.flight_num
            WHERE td.price_per_ticket > $1
            LIMIT $2`;
        return this.executeQuery<ComprehensiveFlight>(query, [minPrice, limit]);
    }
}

async function demonstrateJoins() {
    const queries = new AirlineQueries(pool);
    
    try {
        // 1. INNER JOIN Example
        console.log('\n=== Passenger Details (INNER JOIN) ===');
        await queries.getPassengerDetails();

        // 2. LEFT JOIN Example
        console.log('\n=== Customers with Flights (LEFT JOIN) ===');
        await queries.getCustomersWithFlights();

        // 3. Multiple Table JOIN Example
        console.log('\n=== Comprehensive Flight Information (Multiple JOINs) ===');
        await queries.getComprehensiveFlightInfo();

        // 4. SELF JOIN Example
        console.log('\n=== Routes with Same Distance (SELF JOIN) ===');
        await queries.getRoutesWithSameDistance();

        // 5. FULL OUTER JOIN Example
        console.log('\n=== Routes and Tickets (FULL OUTER JOIN) ===');
        await queries.getRoutesAndTickets();

        // 6. CROSS JOIN Example
        console.log('\n=== All Route-Aircraft Combinations (CROSS JOIN) ===');
        await queries.getAllRouteAircraftCombinations();

        // 7. NATURAL JOIN Example
        console.log('\n=== Common Tickets (NATURAL JOIN) ===');
        await queries.getCommonTickets();

        // 8. Complex Join Example
        console.log('\n=== Complex Flight Information ===');
        await queries.getComplexFlightInfo(100);

    } finally {
        await pool.end();
    }
}

// Run the demonstrations
demonstrateJoins().catch(err => {
    console.error('Error in join demonstrations:', err);
    process.exit(1);
});

