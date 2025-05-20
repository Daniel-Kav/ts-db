# TypeScript PostgreSQL Database Examples

This project demonstrates various PostgreSQL database operations using TypeScript and the `node-postgres` library. It includes examples of different types of database joins, grouping operations, and connection pooling implementations with full type safety.

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
│       ├── joins.ts      # Examples of different SQL JOIN operations
│       ├── grouping.ts   # Examples of GROUP BY and HAVING operations
│       └── types.ts      # Shared TypeScript interfaces and types
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## Features

- Connection pooling with PostgreSQL
- Environment variables configuration using dotenv
- Comprehensive JOIN examples with airline database schema
- Advanced GROUP BY and HAVING examples
- Strongly typed interfaces for all operations
- TypeScript implementation for type safety
- Centralized type definitions
- Table-formatted query results output

## Type System

The project uses a comprehensive type system defined in `src/Examples/types.ts`:

### Database Tables
- `Customer` - Customer information
- `PassengerFlight` - Flight booking details
- `TicketDetail` - Ticket information
- `Route` - Flight route information

### Query Results
- `PassengerDetail` - Join results for passenger information
- `CustomerFlight` - Extended customer information with flight details
- `ComprehensiveFlight` - Complete flight information
- `RouteTicket` - Combined route and ticket information
- `SameDistanceRoute` - Self-join results for route comparisons

### Grouping Results
- `RouteStats` - Statistics for routes
- `CustomerBookingStats` - Customer booking analysis
- `AircraftLoadStats` - Aircraft occupancy information
- `BrandPerformance` - Airline brand performance metrics
- `FlightClassStats` - Statistics by flight class
- `MonthlyBookingTrend` - Booking trends over time

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

<<<<<<< HEAD
The project includes:
various JOIN examples in `src/Examples/joins.ts`:
=======
### JOIN Operations (`src/Examples/joins.ts`)

The project includes various JOIN examples:
>>>>>>> ea5c27a93a63a42695495b1b0c423b4c5291334c

1. **INNER JOIN**: Get passenger travel details with customer information
2. **LEFT JOIN**: Get all customers and their flight details
3. **Multiple Table JOIN**: Get comprehensive flight information
4. **SELF JOIN**: Find routes with same distance
5. **FULL OUTER JOIN**: Find all routes and tickets, including unmatched records
6. **CROSS JOIN**: Generate all possible route-aircraft combinations
7. **NATURAL JOIN**: Join tables based on common column names
8. **Complex Join with Aliases**: Complex queries with multiple conditions

<<<<<<< HEAD
various Conditional operations in `src/Examples/conditional-statements.ts`:

1. **simpleCase**: Perfoms simple case to sort stock in terms of availabilty
2. **caseWithAgg**:To count the number of products in each stock level (Low, Medium, High).
3. **coalesce**: To replace NULL values in the discount_percentage column with 0.


=======
### Grouping Operations (`src/Examples/grouping.ts`)

The project includes various GROUP BY and HAVING examples:

1. **Basic GROUP BY**: Route statistics by origin airport
2. **GROUP BY with HAVING**: High-value customer identification
3. **Complex GROUP BY**: Aircraft load analysis with occupancy rates
4. **Multi-table GROUP BY**: Brand performance analysis
5. **Date-based GROUP BY**: Monthly booking trends
6. **Class Analysis**: Revenue and passenger statistics by flight class
>>>>>>> ea5c27a93a63a42695495b1b0c423b4c5291334c

## Running the Examples

```bash
# Run JOIN examples
pnpm dev:joins

# Run Grouping examples
pnpm dev:grouping

# Run main application
pnpm dev
```

## Best Practices Demonstrated

1. **Type Safety**
   - Strongly typed interfaces for all database operations
   - Type-safe query results
   - Centralized type definitions

2. **Database Connection Management**
   - Connection pooling for better performance
   - Proper resource cleanup
   - Error handling

3. **Code Organization**
   - Modular code structure
   - Separated concerns (types, queries, configuration)
   - Clean and maintainable codebase

4. **Query Organization**
   - Parameterized queries for security
   - Clear and readable SQL statements
   - Comprehensive examples of different SQL operations

5. **Development Experience**
   - Nodemon for automatic reloading
   - Clear console output with table formatting
   - Detailed error messages

## Dependencies

- `pg`: PostgreSQL client for Node.js
- `@types/pg`: TypeScript types for pg
- `dotenv`: Environment variable management
- `ts-node`: TypeScript execution
- `nodemon`: Development server with auto-reload
