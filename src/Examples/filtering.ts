import { pool, executeQuery } from '../db.config';


async function demonstrateFiltering() {
    try {
        // 1. Filter by specific flight number
        const filterByFlightNumQuery = `
            SELECT * 
            FROM routes 
            WHERE aircraft_id = '767-301ER'
            LIMIT 5`;
        // const filterByFlightNumResult = await executeQuery(filterByFlightNumQuery);
        // console.table(filterByFlightNumResult);
        // 2. Filter by date range
        const filterByDateRangeQuery = `
            SELECT * 
            FROM passengers_on_flights 
            WHERE travel_date BETWEEN '01-01-2018' AND '31-12-2020'
            LIMIT 5`;
        // const filterByDateRangeResult = await executeQuery(filterByDateRangeQuery);
        // console.table(filterByDateRangeResult);
        // 3. Filter by customer attributes
        const filterByCustomerQuery = `
            SELECT * 
            FROM customer 
            WHERE gender = 'F'
            AND date_of_birth BETWEEN '01-01-1990' AND '12-31-2000'
            LIMIT 5`;
        // const filterByCustomerResult = await executeQuery(filterByCustomerQuery);
        // console.table(filterByCustomerResult);
        // 4. Filter by multiple conditions
        const filterByMultipleConditionsQuery = `
            SELECT * 
            FROM ticket_details 
            WHERE class_id = 'Economy'
            AND brand = 'Boeing'
            LIMIT 5`;
        const filterByMultipleConditionsResult = await executeQuery(filterByMultipleConditionsQuery);
        console.table(filterByMultipleConditionsResult);
        // 5. Filter by pattern matching
        const filterByPatternMatchingQuery = `
            SELECT * 
            FROM routes 
            WHERE origin_airport LIKE 'LAX%'
            LIMIT 5`;
        // const filterByPatternMatchingResult = await executeQuery(filterByPatternMatchingQuery);
        // console.table(filterByPatternMatchingResult);
        // // 6. Filter by NULL values
        const filterByNullValuesQuery = `
            SELECT * 
            FROM passengers_on_flights 
            WHERE seat_num IS NULL
            LIMIT 5`;
        // const filterByNullValuesResult = await executeQuery(filterByNullValuesQuery);
        // console.table(filterByNullValuesResult);
        // 7. Filter by NOT NULL values
        const filterByNotNullValuesQuery = `
            SELECT * 
            FROM passengers_on_flights 
            WHERE seat_num IS NOT NULL
            LIMIT 5`;
        // const filterByNotNullValuesResult = await executeQuery(filterByNotNullValuesQuery);
        // console.table(filterByNotNullValuesResult);
        // 8. Filter by IN clause
        const filterByInClauseQuery = `
            SELECT * 
            FROM routes 
            WHERE aircraft_id IN ('CRJ900', 'A321')
            LIMIT 5`;
        // const filterByInClauseResult = await executeQuery(filterByInClauseQuery);
        // console.table(filterByInClauseResult);
        // 9. Filter by NOT IN clause
        const filterByNotInClauseQuery = `
            SELECT * 
            FROM routes 
            WHERE aircraft_id NOT IN ('CRJ900', 'A321')
            LIMIT 5`;
        // const filterByNotInClauseResult = await executeQuery(filterByNotInClauseQuery);
        // console.table(filterByNotInClauseResult);
        // 10. Filter by EXISTS clause
        const filterByExistsClauseQuery = ` 
            SELECT * 
            FROM routes r
            WHERE EXISTS (
                SELECT 1 
                FROM passengers_on_flights pf 
                WHERE pf.route_id = r.route_id
            )
            LIMIT 5`;
        // const filterByExistsClauseResult = await executeQuery(filterByExistsClauseQuery);
        // console.table(filterByExistsClauseResult);
        // 11. Filter by NOT EXISTS clause
        const filterByNotExistsClauseQuery = `
            SELECT * 
            FROM routes r
            WHERE NOT EXISTS (
                SELECT 1 
                FROM passengers_on_flights pf 
                WHERE pf.route_id = r.route_id
            )
            LIMIT 5`;
        // const filterByNotExistsClauseResult = await executeQuery(filterByNotExistsClauseQuery);
        // console.table(filterByNotExistsClauseResult);
        // 12. Filter by BETWEEN clause
        const filterByBetweenClauseQuery = `
            SELECT * 
            FROM ticket_details 
            WHERE price_per_ticket BETWEEN 100 AND 500
            LIMIT 5`;
        // const filterByBetweenClauseResult = await executeQuery(filterByBetweenClauseQuery);
        // console.table(filterByBetweenClauseResult);
        // 13. Filter by NOT BETWEEN clause
        const filterByNotBetweenClauseQuery = `
            SELECT * 
            FROM ticket_details 
            WHERE price_per_ticket NOT BETWEEN 100 AND 500
            LIMIT 5`;
        // const filterByNotBetweenClauseResult = await executeQuery(filterByNotBetweenClauseQuery);
        // console.table(filterByNotBetweenClauseResult);
        //14. filter by limit and fetch
        const filterByLimitAndFetchQuery = `
            SELECT * 
            FROM routes 
            LIMIT 5 OFFSET 10`;
        // const filterByLimitAndFetchResult = await executeQuery(filterByLimitAndFetchQuery);
        // console.table(filterByLimitAndFetchResult);

    
    }
    catch (error) {
        console.error('Error executing query:', error);
    }
    finally {
        // Close the pool when done
        await pool.end();
    }
}
// Run the filtering demonstration
demonstrateFiltering().catch(err => {
    console.error('Error in filtering demonstration:', err);
    process.exit(1);
});











