import { pool, executeQuery } from '../db.config';

// Utility function to execute queries


async function demonstrateJoins() {
    try {
        // 1. INNER JOIN Example: Get passenger travel details with customer information
        const innerJoinQuery = `
            SELECT 
                pf.flight_num,
                c.first_name,
                c.last_name,
                pf.seat_num,
                pf.travel_date
            FROM passengers_on_flights pf
            INNER JOIN customer c ON pf.customer_id = c.customer_id
            LIMIT 5`;
        await executeQuery(innerJoinQuery);

        // 2. LEFT JOIN Example: Get all customers and their flight details (if any)
        const leftJoinQuery = `
            SELECT 
                c.customer_id,
                c.first_name,
                c.last_name,
                pf.flight_num,
                pf.travel_date
            FROM customer c
            LEFT JOIN passengers_on_flights pf ON c.customer_id = pf.customer_id
            LIMIT 5`;
        const leftjointable = await executeQuery(leftJoinQuery);
        console.table(leftjointable)

        // 3. Multiple Table JOIN Example: Get comprehensive flight information
        const multiJoinQuery = `
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
            LIMIT 5`;
        await executeQuery(multiJoinQuery);

        // 4. SELF JOIN Example: Find routes with same distance
        const selfJoinQuery = `
            SELECT 
                r1.flight_num as flight1,
                r2.flight_num as flight2,
                r1.distance_miles
            FROM routes r1
            INNER JOIN routes r2 ON 
                r1.distance_miles = r2.distance_miles AND
                r1.flight_num < r2.flight_num
            LIMIT 5`;
        await executeQuery(selfJoinQuery);

        // 5. FULL OUTER JOIN Example: Find all routes and tickets, including unmatched records
        const fullOuterJoinQuery = `
            SELECT 
                r.flight_num,
                r.origin_airport,
                r.destination_airport,
                td.brand,
                td.price_per_ticket
            FROM routes r
            FULL OUTER JOIN ticket_details td ON r.aircraft_id = td.aircraft_id
            LIMIT 5`;
        await executeQuery(fullOuterJoinQuery);

        // 6. CROSS JOIN Example: Generate all possible route-aircraft combinations
        const crossJoinQuery = `
            SELECT DISTINCT 
                r.flight_num,
                td.brand,
                r.origin_airport,
                r.destination_airport
            FROM routes r
            CROSS JOIN ticket_details td
            LIMIT 5`;
        await executeQuery(crossJoinQuery);

        // 7. NATURAL JOIN Example (assuming common column names)
        const naturalJoinQuery = `
            SELECT 
                customer_id,
                aircraft_id,
                class_id
            FROM passengers_on_flights
            NATURAL JOIN ticket_details
            LIMIT 5`;
        await executeQuery(naturalJoinQuery);

        // 8. Table Aliases with Complex Conditions
        const complexJoinQuery = `
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
            WHERE td.price_per_ticket > 100
            LIMIT 5`;
        await executeQuery(complexJoinQuery);

    } finally {
        // Close the pool when done
        await pool.end();
    }
}

// Run the demonstrations
demonstrateJoins().catch(err => {
    console.error('Error in join demonstrations:', err);
    process.exit(1);
});

