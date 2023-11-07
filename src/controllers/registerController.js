const db = require('../../db/db'); // Import your database connection

// Function to calculate the approved_limit based on monthly_income
function calculateApprovedLimit(monthly_salary) {
  return Math.round(monthly_salary * 36 / 100000) * 100000; // Rounded to the nearest lakh
}

// Register a new customer
const registerCustomer = (req, res) => {
  const { first_name, last_name, age, phone_number, monthly_salary } = req.body;

  // Check if required fields are missing
  if (!first_name || !last_name || !age || !phone_number || !monthly_salary) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  // Calculate the approved_limit based on monthly_income
  const approved_limit = calculateApprovedLimit(monthly_salary);

  // Check if a customer with the same phone_number already exists
  db.query('SELECT customer_id FROM customers WHERE phone_number = ?', [phone_number], (err, rows) => {
    if (err) {
      console.error('Error checking customer: ' + err.message);
      return res.status(500).json({ error: 'An error occurred while checking the customer.' });
    }

    if (rows.length > 0) {
      // Customer with the same phone_number already exists
      return res.status(400).json({ error: 'Customer already registered' });
    }

    // Customer doesn't exist, proceed to insert
    const newCustomer = {
      first_name,
      last_name,
      age,
      phone_number,
      monthly_salary,
      approved_limit,
    };

    // Insert the customer record into the database
    db.query('INSERT INTO customers SET ?', newCustomer, (err, result) => {
      if (err) {
        console.error('Error registering customer: ' + err.message);
        res.status(500).json({ error: 'An error occurred while registering the customer.' });
      } else {
        const customer_id = result.insertId;
        const name = `${first_name} ${last_name}`;
        res.status(201).json({
          customer_id,
          name,
          age,
          phone_number,
          monthly_salary,
          approved_limit,
        });
      }
    });
  });
};

module.exports = {
  registerCustomer
};
