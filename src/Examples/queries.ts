import { pool,executeQuery } from "../db.config";

// tables
// -- customer
// -- ticket_details
// -- passengers_on_flights
// -- routes


// different types of queries
// -- SELECT
//  -- with -- WHERE,ORDER BY, GROUP BY, HAVING
//  -- with -- JOIN, aggregate functions(count, sum, avg, min, max)
//  -- with -- subqueries
//  -- INSERT,UPDATE, DELETE queries



async function demonstrateQuerying() {
    try {
        
    // 1. Basic SELECT query
    const basicSelectQuery = `
        SELECT * 
        FROM customer 
        LIMIT 5`;

    const basicSelectResult = await executeQuery(basicSelectQuery);
    console.table(basicSelectResult);

    // 2. SELECT with WHERE clause
    const whereClauseQuery = `
        SELECT * 
        FROM customer 
        WHERE age > 30 
        LIMIT 5`;

    const whereClauseResult = await executeQuery(whereClauseQuery);
    console.table(whereClauseResult);

    // 3. SELECT with ORDER BY clause
    const orderByClauseQuery = `
        SELECT * 
        FROM customer 
        ORDER BY age DESC 
        LIMIT 5`;

    const orderByClauseResult = await executeQuery(orderByClauseQuery);
    console.table(orderByClauseResult);

    // 4. SELECT with GROUP BY clause
    const groupByClauseQuery = `
        SELECT *
        FROM ticket_details
        WHERE class_id = 'Economy'
        GROUP BY
        brand = "Emirates"
        LIMIT 5`;

    const groupByClauseResult = await executeQuery(groupByClauseQuery);
    console.table(groupByClauseResult);

    // 5. SELECT with HAVING clause
    const havingClauseQuery = `
        SELECT COUNT(*) AS total_passengers, flight_id
        FROM passengers_on_flights
        GROUP BY flight_id
        HAVING COUNT(*) > 100
        LIMIT 5`;

    const havingClauseResult = await executeQuery(havingClauseQuery);
    console.table(havingClauseResult);

    // 6. SELECT with JOIN clause
    const joinClauseQuery = `
        SELECT p.passenger_id, p.first_name, p.last_name, f.flight_id
        FROM passengers_on_flights AS p
        JOIN flights AS f ON p.flight_id = f.flight_id
        LIMIT 5`;

    const joinClauseResult = await executeQuery(joinClauseQuery);
    console.table(joinClauseResult);

    // 7. SELECT with aggregate functions -- consider adding age column to customer table
    const aggregateFunctionsQuery = `
        SELECT AVG(age) AS average_age, MAX(age) AS max_age, MIN(age) AS min_age
        FROM customer
        LIMIT 5`;

    const aggregateFunctionsResult = await executeQuery(aggregateFunctionsQuery);
    console.table(aggregateFunctionsResult);

    // 8. SELECT with subqueries
    const subqueryQuery = `
        SELECT *
        FROM customer
        WHERE customer_id IN (
            SELECT customer_id
            FROM ticket_details
            WHERE class_id = 'Economy'
        )
        LIMIT 5`;

    const subqueryResult = await executeQuery(subqueryQuery);
    console.table(subqueryResult);

    // 9. INSERT query
    const insertQuery = `
        INSERT INTO customer (first_name, last_name, gender, date_of_birth)
        VALUES ('John', 'Doe', 'M', '1990-01-01')`;
    const insertResult = await executeQuery(insertQuery);
    console.log("Insert Result:", insertResult);

    // 10. UPDATE query
    const updateQuery = `
        UPDATE customer
        SET
        first_name = 'Jane'
        WHERE first_name = 'John'`;

    const updateResult = await executeQuery(updateQuery);
    console.log("Update Result:", updateResult);

    // 11. DELETE query
    const deleteQuery = `
        DELETE FROM customer
        WHERE first_name = 'Jane'`;
    const deleteResult = await executeQuery(deleteQuery);
    console.log("Delete Result:", deleteResult);

        
    } catch (error) {
        console.error("Error executing query:", error);
        
    }
}


// Call the function to demonstrate querying
demonstrateQuerying()
    .then(() => {
        console.log("===Querying demonstration completed.===");
    })
    .catch((error) => {
        console.error("Error in querying demonstration:", error);
    });