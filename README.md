# TypeScript PostgreSQL Database Examples

This project demonstrates various PostgreSQL database operations using TypeScript and the `node-postgres` library. It includes examples of different types of database joins and connection pooling implementations.

## Project Structure

```
ts-db/
|__ assets
|     |__airlines_dataset.zip
|     
|      
├── src/
│   ├── db.config.ts      # Database configuration and pool setup
│   ├── main.ts           # Main application entry point
│   └── Examples/
│       └── joins.ts      # Examples of different SQL JOIN operations
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## Features

- Connection pooling with PostgreSQL
- Environment variables configuration using dotenv
- Comprehensive JOIN examples with airline database schema
- TypeScript implementation for type safety

## Database Schema

The project works with an airline database that includes the following tables:

### passengers_on_flights
- `aircraft_id` - ID of each aircraft in a brand
- `route_id` - Route ID of from and to location
- `customer_id` - ID of the customer
- `depart` - Departure place from the airport
- `arrival` - Arrival place in the airport
- `seat_num` - Unique seat number for each passenger
- `class_id` - ID of travel class
- `travel_date` - Travel date of each passenger
- `flight_num` - Specific flight number for each route

### ticket_details
- `p_date` - Ticket purchase date
- `customer_id` - ID of the customer
- `aircraft_id` - ID of each aircraft in a brand
- `class_id` - ID of travel class
- `no_of_tickets` - Number of tickets purchased
- `a_code` - Code of each airport
- `price_per_ticket` - Price of a ticket
- `brand` - Aviation service provider for each aircraft

### routes
- `route_id` - Route ID of from and to location
- `flight_num` - Specific fight number for each route
- `origin_airport` - Departure location
- `destination_airport` - Arrival location
- `aircraft_id` - ID of each aircraft in a brand
- `distance_miles` - Distance between departure and arrival location

### customer
- `customer_id` - ID of the customer
- `first_name` - First name of the customer
- `last_name` - Last name of the customer
- `date_of_birth` - Date of birth of the customer
- `gender` - Gender of the customer

The Product database with the following table:
### products
- `product-id` - ID of the product
- `product_name` - name of the product
- `category` - category of products
- `price` - price of the product
- `stock_quantity` - amount of stock availale for a product
- `rating` - customer rating for each product
- `discount_available` - boolean value whether product has discount
- `discount_percentage` - the percentage of discount given to a product


## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the root directory with your database credentials:
   ```env
   DB_USER=your_username
   DB_HOST=your_host
   DB_NAME=your_database_name
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

## Examples

The project includes:
various JOIN examples in `src/Examples/joins.ts`:

1. **INNER JOIN**: Get passenger travel details with customer information
2. **LEFT JOIN**: Get all customers and their flight details
3. **Multiple Table JOIN**: Get comprehensive flight information
4. **SELF JOIN**: Find routes with same distance
5. **FULL OUTER JOIN**: Find all routes and tickets, including unmatched records
6. **CROSS JOIN**: Generate all possible route-aircraft combinations
7. **NATURAL JOIN**: Join tables based on common column names
8. **Complex Join with Aliases**: Complex queries with multiple conditions

various Conditional operations in `src/Examples/conditional-statements.ts`:

1. **simpleCase**: Perfoms simple case to sort stock in terms of availabilty
2. **caseWithAgg**:To count the number of products in each stock level (Low, Medium, High).
3. **coalesce**: To replace NULL values in the discount_percentage column with 0.



## Running the Examples

To run the JOIN examples:
```bash
pnpm dev:joins
```

## Database Connection

The project uses connection pooling for better performance and resource management. The pool configuration includes:

- Maximum 20 clients in the pool
- 30 seconds idle timeout
- 2 seconds connection timeout

## Best Practices Demonstrated

1. **Environment Variables**: Sensitive information is stored in `.env` file
2. **Connection Pooling**: Efficient database connection management
3. **Error Handling**: Proper try-catch blocks and resource cleanup
4. **TypeScript**: Type safety and better development experience
5. **Query Organization**: Well-structured and documented SQL queries
6. **Resource Management**: Proper release of database connections

## Dependencies

- `pg`: PostgreSQL client for Node.js
- `dotenv`: Environment variable management
- `typescript`: TypeScript support
- `ts-node`: TypeScript execution environment

## Development

The project uses TypeScript for type safety and better development experience. The configuration can be found in `tsconfig.json`.

## Note

Make sure to properly configure your PostgreSQL database and update the environment variables before running the examples.
