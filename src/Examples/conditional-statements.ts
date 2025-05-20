import { pool, executeQuery } from '../db.config';

async function demonstratingConditionals() {
  try {
    const simpleCase = `
                SELECT 
                  customer_id,
                  name,
                  age,
              CASE 
                  WHEN age < 18 THEN 'Minor'
                  WHEN age BETWEEN 18 AND 64 THEN 'Adult'
                  ELSE 'Senior'
                  END AS age_category
              FROM customer;

            `;

    await executeQuery(simpleCase);


    const caseWithAgg = ` 
                          SELECT 
                            COUNT(CASE WHEN age < 18 THEN 1 END) AS minors,
                            COUNT(CASE WHEN age BETWEEN 18 AND 64 THEN 1 END) AS adults,
                            COUNT(CASE WHEN age >= 65 THEN 1 END) AS seniors
                          FROM customer
                        `;

    const coalesce = `
                    SELECT 
                      ticket_id,
                      price,
                      COALESCE(discount, 0) AS discount,
                      price - COALESCE(discount, 0) AS final_price
                    FROM ticket_details
                    `;

    await executeQuery(coalesce);

    const nullIf = `
                SELECT 
                  flight_id,
                  total_revenue,
                  num_passengers,
                  total_revenue / NULLIF(num_passengers, 0) AS revenue_per_passenger
                FROM passengers_on_flights
                `;

    await executeQuery(nullIf);

    const castExample = `
                        SELECT 
                            100.0 * COUNT(CASE WHEN discount IS NOT NULL AND discount > 0 THEN 1 END)::NUMERIC / 
                            NULLIF(COUNT(*), 0) AS percent_with_discount
                            FROM ticket_details
                        `;

    await executeQuery(castExample);
  } catch (err) {
    console.error('An error ocurred', err);
  } finally {
    await pool.end();
  }
}