import { pool } from '../db.config';
import type {
    RouteStats,
    CustomerBookingStats,
    AircraftLoadStats,
    BrandPerformance,
    FlightClassStats,
    MonthlyBookingTrend
} from './types';

class AirlineGroupQueries {
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

    // 1. Basic GROUP BY: Route Statistics
    async getRouteStatistics(): Promise<RouteStats[]> {
        const query = `
            SELECT 
                origin_airport,
                COUNT(*) as total_flights,
                ROUND(AVG(distance_miles)::numeric, 2) as avg_distance,
                MIN(distance_miles) as min_distance,
                MAX(distance_miles) as max_distance
            FROM routes
            GROUP BY origin_airport
            ORDER BY total_flights DESC
            LIMIT 10`;
        return this.executeQuery<RouteStats>(query);
    }

    // 2. GROUP BY with HAVING: High-Value Customers
    async getHighValueCustomers(minBookings: number = 3): Promise<CustomerBookingStats[]> {
        const query = `
            SELECT 
                c.customer_id,
                c.first_name,
                c.last_name,
                COUNT(pf.flight_num) as total_bookings,
                SUM(td.price_per_ticket) as total_spent,
                ROUND(AVG(td.price_per_ticket)::numeric, 2) as avg_ticket_price
            FROM customer c
            JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            JOIN ticket_details td ON pf.customer_id = td.customer_id
            GROUP BY c.customer_id, c.first_name, c.last_name
            HAVING COUNT(pf.flight_num) >= $1
            ORDER BY total_spent DESC
            LIMIT 10`;
        return this.executeQuery<CustomerBookingStats>(query, [minBookings]);
    }

    // 3. Complex GROUP BY: Aircraft Load Analysis
    async getAircraftLoadStats(): Promise<AircraftLoadStats[]> {
        const query = `
            SELECT 
                pf.aircraft_id,
                pf.flight_num,
                COUNT(pf.customer_id) as total_passengers,
                ROUND((COUNT(pf.customer_id)::float / 
                    MAX(CASE 
                        WHEN td.class_id = 'economy' THEN 200
                        WHEN td.class_id = 'business' THEN 30
                        ELSE 10 END))::numeric * 100, 2) as occupancy_rate
            FROM passengers_on_flights pf
            JOIN ticket_details td ON pf.aircraft_id = td.aircraft_id
            GROUP BY pf.aircraft_id, pf.flight_num
            HAVING COUNT(pf.customer_id) > 10
            ORDER BY occupancy_rate DESC
            LIMIT 10`;
        return this.executeQuery<AircraftLoadStats>(query);
    }

    // 4. GROUP BY with Multiple Tables: Brand Performance
    async getBrandPerformance(minRevenue: number = 5000): Promise<BrandPerformance[]> {
        const query = `
            SELECT 
                td.brand,
                SUM(td.price_per_ticket) as total_revenue,
                COUNT(*) as tickets_sold,
                ROUND(AVG(td.price_per_ticket)::numeric, 2) as avg_ticket_price
            FROM ticket_details td
            JOIN passengers_on_flights pf ON td.aircraft_id = pf.aircraft_id
            GROUP BY td.brand
            HAVING SUM(td.price_per_ticket) > $1
            ORDER BY total_revenue DESC`;
        return this.executeQuery<BrandPerformance>(query, [minRevenue]);
    }

    // 5. GROUP BY with Date Functions: Monthly Booking Trends
    async getMonthlyBookingTrends(): Promise<MonthlyBookingTrend[]> {
        const query = `
            SELECT 
                DATE_TRUNC('month', travel_date::timestamp) as booking_month,
                COUNT(*) as total_bookings,
                ROUND(AVG(td.price_per_ticket)::numeric, 2) as avg_ticket_price,
                SUM(td.price_per_ticket) as total_revenue
            FROM passengers_on_flights pf
            JOIN ticket_details td ON pf.customer_id = td.customer_id
            GROUP BY DATE_TRUNC('month', travel_date::timestamp)
            ORDER BY booking_month DESC
            LIMIT 12`;
        return this.executeQuery<MonthlyBookingTrend>(query);
    }

    // 6. GROUP BY with Class Analysis
    async getFlightClassStatistics(): Promise<FlightClassStats[]> {
        const query = `
            SELECT 
                pf.class_id,
                COUNT(DISTINCT pf.customer_id) as total_passengers,
                ROUND(AVG(td.price_per_ticket)::numeric, 2) as avg_ticket_price,
                SUM(td.price_per_ticket) as total_revenue
            FROM passengers_on_flights pf
            JOIN ticket_details td ON pf.class_id = td.class_id
            GROUP BY pf.class_id
            ORDER BY total_revenue DESC`;
        return this.executeQuery<FlightClassStats>(query);
    }
}

async function demonstrateGrouping() {
    const queries = new AirlineGroupQueries(pool);
    
    try {
        // 1. Route Statistics
        console.log('\n=== Route Statistics by Origin Airport ===');
        await queries.getRouteStatistics();

        // 2. High-Value Customers
        console.log('\n=== High-Value Customers (3+ bookings) ===');
        await queries.getHighValueCustomers(3);

        // 3. Aircraft Load Analysis
        console.log('\n=== Aircraft Load Statistics ===');
        await queries.getAircraftLoadStats();

        // 4. Brand Performance
        console.log('\n=== Airline Brand Performance ===');
        await queries.getBrandPerformance(5000);

        // 5. Monthly Booking Trends
        console.log('\n=== Monthly Booking Trends ===');
        await queries.getMonthlyBookingTrends();

        // 6. Flight Class Analysis
        console.log('\n=== Flight Class Statistics ===');
        await queries.getFlightClassStatistics();

    } finally {
        await pool.end();
    }
}

// Run the demonstrations
demonstrateGrouping().catch(err => {
    console.error('Error in grouping demonstrations:', err);
    process.exit(1);
});
