-- Create customer table
CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth VARCHAR(20),
    gender CHAR(1)
);

-- Create routes table
CREATE TABLE routes (
    route_id INT PRIMARY KEY,
    flight_num VARCHAR(10),
    origin_airport VARCHAR(3),
    destination_airport VARCHAR(3),
    aircraft_id VARCHAR(10),
    distance_miles INT
);

-- Create passengers_on_flights table
CREATE TABLE passengers_on_flights (
    customer_id INT,
    aircraft_id VARCHAR(10),
    route_id INT,
    depart VARCHAR(3),
    arrival VARCHAR(3),
    seat_num VARCHAR(5),
    class_id VARCHAR(20),
    travel_date VARCHAR(20),
    flight_num VARCHAR(10),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Create ticket_details table
CREATE TABLE ticket_details (
    p_date VARCHAR(20),
    customer_id INT,
    aircraft_id VARCHAR(10),
    class_id VARCHAR(20),
    no_of_tickets INT,
    a_code VARCHAR(5),
    price_per_ticket DECIMAL(10,2),
    brand VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);