const db = require('./db');

const createCustomersTable = `
  CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    age INT,
    phone_number VARCHAR(20),
    monthly_salary DECIMAL(10, 2),
    approved_limit DECIMAL(10, 2),
    current_debt DECIMAL(10, 2)
  );
`;

const createLoansTable = `
  CREATE TABLE IF NOT EXISTS loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    loan_amount DECIMAL(10, 2),
    tenure INT,
    interest_rate DECIMAL(5, 2),
    monthly_payment DECIMAL(10, 2),
    EMIs_paid_on_Time INT,
    start_date DATE,
    end_date DATE,
    amount_paid DECIMAL(10, 2),
    EMIs_paid INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
  );
`;

db.query(createCustomersTable, (err, result) => {
  if (err) {
    console.error('Error creating the customers table: ' + err.message);
  } else {
    console.log('Customers table created');
  }

  db.query(createLoansTable, (err, result) => {
    if (err) {
      console.error('Error creating the loans table: ' + err.message);
    } else {
      console.log('Loans table created');
    }
  });
});
