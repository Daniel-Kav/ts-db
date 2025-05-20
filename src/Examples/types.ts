// Database table interfaces
export interface Customer {
    customer_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: string;
}

export interface PassengerFlight {
    aircraft_id: string;
    route_id: string;
    customer_id: string;
    depart: string;
    arrival: string;
    seat_num: string;
    class_id: string;
    travel_date: Date;
    flight_num: string;
}

export interface TicketDetail {
    p_date: Date;
    customer_id: string;
    aircraft_id: string;
    class_id: string;
    no_of_tickets: number;
    a_code: string;
    price_per_ticket: number;
    brand: string;
}

export interface Route {
    route_id: string;
    flight_num: string;
    origin_airport: string;
    destination_airport: string;
    aircraft_id: string;
    distance_miles: number;
}

// Query result interfaces
export interface PassengerDetail {
    flight_num: string;
    first_name: string;
    last_name: string;
    seat_num: string;
    travel_date: Date;
}

export interface CustomerFlight extends Customer {
    flight_num?: string;
    travel_date?: Date;
}

export interface ComprehensiveFlight {
    first_name: string;
    last_name: string;
    flight_num: string;
    origin_airport: string;
    destination_airport: string;
    price_per_ticket: number;
    brand: string;
}

export interface SameDistanceRoute {
    flight1: string;
    flight2: string;
    distance_miles: number;
}

export interface RouteTicket {
    flight_num: string;
    origin_airport: string;
    destination_airport: string;
    brand: string | null;
    price_per_ticket: number | null;
}

// Grouping query result interfaces
export interface RouteStats {
    origin_airport: string;
    total_flights: number;
    avg_distance: number;
    min_distance: number;
    max_distance: number;
}

export interface CustomerBookingStats {
    customer_id: string;
    first_name: string;
    last_name: string;
    total_bookings: number;
    total_spent: number;
    avg_ticket_price: number;
}

export interface AircraftLoadStats {
    aircraft_id: string;
    flight_num: string;
    total_passengers: number;
    occupancy_rate: number;
}

export interface BrandPerformance {
    brand: string;
    total_revenue: number;
    tickets_sold: number;
    avg_ticket_price: number;
}

export interface FlightClassStats {
    class_id: string;
    total_passengers: number;
    avg_ticket_price: number;
    total_revenue: number;
}

export interface MonthlyBookingTrend {
    booking_month: Date;
    total_bookings: number;
    avg_ticket_price: number;
    total_revenue: number;
}
