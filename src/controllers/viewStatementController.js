const db = require('../../db/db');

// Function to view the statement of a particular loan
const viewStatement = (req, res) => {
  const { customer_id, loan_id } = req.params;

  // Fetch loan details from the database
  db.query('SELECT * FROM loans WHERE loan_id = ? AND customer_id = ?', [loan_id, customer_id], (err, rows) => {
    if (err) {
      console.error('Error fetching loan details: ' + err.message);
      return res.status(500).json({ message: 'An error occurred while fetching loan details' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const loan = rows[0];
    const { customer_id, loan_id, loan_amount, interest_rate, tenure, amount_paid, EMIs_paid } = loan;

    // Calculate the number of EMIs left
    const repaymentsLeft = tenure - EMIs_paid;

    // Respond with the statement
    res.status(200).json({
      customer_id,
      loan_id,
      principal: loan_amount,
      interest_rate,
      amount_paid,
      monthly_installment: loan.monthly_payment,
      repayments_left: repaymentsLeft,
    });
  });
};

module.exports = {
  viewStatement,
};
