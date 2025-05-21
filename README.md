# TypeScript PostgreSQL Database Examples

This project demonstrates various PostgreSQL database operations using TypeScript and the `node-postgres` library. It includes examples of different types of database operations, connection pooling implementations, and full type safety.

## Project Structure

```
ts-db/
├── src/
│   ├── db.config.ts           # Database configuration and pool setup
│   ├── main.ts               # Main application entry point
│   ├── airline.sql           # Database schema and initial data
│   └── Examples/
│       ├── data-modification.ts  # CRUD operations and data manipulation
│       ├── joins.ts          # Examples of different SQL JOIN operations
│       ├── filtering.ts      # WHERE clause and filtering examples
│       ├── grouping.ts       # GROUP BY and HAVING operations
│       ├── conditional-statements.ts  # CASE, COALESCE, NULLIF examples
│       ├── set-operations.ts # UNION, INTERSECT, EXCEPT operations
│       ├── sets-cubes.ts     # GROUPING SETS, CUBE, ROLLUP examples
│       └── types.ts          # Shared TypeScript interfaces and types
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- Connection pooling with PostgreSQL
- Environment variables configuration using dotenv
- Comprehensive database operations:
  - CRUD operations with auto-incrementing IDs
  - JOIN operations with airline database schema
  - Advanced filtering and WHERE clauses
  - GROUP BY and HAVING examples
  - Conditional statements (CASE, COALESCE, NULLIF)
  - Set operations (UNION, INTERSECT, EXCEPT)
  - Advanced grouping (GROUPING SETS, CUBE, ROLLUP)
- Strongly typed interfaces for all operations
- TypeScript implementation for type safety
- Centralized type definitions
- Table-formatted query results output
- Automatic sequence management for IDs

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

### customer
- `customer_id` - Auto-incrementing ID of the customer
- `first_name` - First name of the customer
- `last_name` - Last name of the customer
- `date_of_birth` - Date of birth of the customer
- `gender` - Gender of the customer

### routes
- `route_id` - Auto-incrementing ID of the route
- `flight_num` - Specific flight number for each route
- `origin_airport` - Departure location
- `destination_airport` - Arrival location
- `aircraft_id` - ID of each aircraft in a brand
- `distance_miles` - Distance between departure and arrival location

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
4. Import the database schema:
   ```bash
   psql -U your_username -d your_database_name -f src/airline.sql
   ```

## Running the Examples

The project includes several example scripts that demonstrate different database operations:

```bash
# Run data modification examples (CRUD operations)
pnpm dev:modify

# Run JOIN examples (INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOINs)
pnpm dev:joins

# Run filtering examples (WHERE clauses and advanced filtering)
pnpm dev:filtering

# Run grouping examples (GROUP BY, HAVING, and aggregation functions)
pnpm dev:grouping

# Run conditional statement examples (CASE, COALESCE, NULLIF)
pnpm dev:conditionals

# Run set operation examples (UNION, INTERSECT, EXCEPT)
pnpm dev:set-ops

# Run main application
pnpm dev
```

Each script demonstrates different aspects of PostgreSQL operations with TypeScript:

- `dev:modify`: Shows CRUD operations with auto-incrementing IDs and sequence management
- `dev:joins`: Demonstrates various types of SQL JOIN operations with the airline database
- `dev:filtering`: Examples of WHERE clauses and advanced filtering techniques
- `dev:grouping`: Shows GROUP BY, HAVING, and aggregation function usage
- `dev:conditionals`: Demonstrates CASE statements, COALESCE, and NULLIF operations
- `dev:set-ops`: Examples of set operations like UNION, INTERSECT, and EXCEPT
- `dev`: Runs the main application with all examples

## Best Practices Demonstrated

1. **Type Safety**
   - Strongly typed interfaces for all database operations
   - Type-safe query results
   - Centralized type definitions

2. **Database Connection Management**
   - Connection pooling for better performance
   - Proper resource cleanup
   - Error handling
   - Automatic sequence management

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
- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution environment
