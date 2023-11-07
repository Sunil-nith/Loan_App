const db = require('../../db/db');

// Define a function to view loan details and customer details
const viewLoan = (req, res) => {
  const loanId = req.params.loan_id;

  // Retrieve loan and customer details from the database based on the loan_id
  db.query(
    'SELECT loans.loan_id, loans.customer_id, loans.loan_amount, loans.interest_rate, loans.monthly_payment AS monthly_installment, loans.tenure, customers.first_name, customers.last_name, customers.phone_number, customers.age FROM loans INNER JOIN customers ON loans.customer_id = customers.customer_id WHERE loans.loan_id = ?',
    [loanId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching loan details: ' + err.message);
        return res.status(500).json({ message: 'Internal server error' });
      } else if (rows.length === 0) {
        return res.status(404).json({ message: 'Loan not found' });
      } else {
        const loan = rows[0];
        const response = {
          loan_id: loan.loan_id,
          customer: {
            id: loan.customer_id,
            first_name: loan.first_name,
            last_name: loan.last_name,
            phone_number: loan.phone_number,
            age: loan.age,
          },
          loan_amount: loan.loan_amount,
          interest_rate: loan.interest_rate,
          monthly_installment: loan.monthly_installment,
          tenure: loan.tenure,
        };
        return res.status(200).json(response);
      }
    }
  );
};

module.exports = {
  viewLoan,
};
