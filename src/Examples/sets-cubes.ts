import {pool, executeQuery} from "../db.config";

async function demonstrateSetAndCubes(){
    try{
        const groupingSets = `
  SELECT 
    fare_type,
    flight_id,
    SUM(price) AS total_revenue
  FROM ticket_details
  GROUP BY GROUPING SETS (
    (fare_type),
    (flight_id),
    ()
  );
`;

await executeQuery(groupingSets);

const rollup = `
  SELECT 
    fare_type,
    SUM(price) AS total_revenue
  FROM ticket_details
  GROUP BY ROLLUP(fare_type);
`;

await executeQuery(rollup);

const cube = `
  SELECT 
    route_id,
    EXTRACT(MONTH FROM flight_date) AS month,
    COUNT(*) AS passenger_count
  FROM passengers_on_flights
  GROUP BY CUBE(route_id, EXTRACT(MONTH FROM flight_date));
`;

await executeQuery(cube);
    }finally{
        pool.end();
    }
}

demonstrateSetAndCubes().catch(e=>{
    console.log("Error:", e);
    process.exit(-1);
});