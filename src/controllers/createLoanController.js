const db = require('../../db/db');
const { checkEligibility } = require('./checkEligibilityController');

// Create a new loan
const createLoan = (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;

  // Check eligibility using the checkEligibility controller
  checkEligibility(customer_id, loan_amount, interest_rate, tenure, (eligibilityData) => {
    const { approval, correctedInterestRate, tenure, monthly_installment } = eligibilityData;

    if (approval) {
      // Loan is approved, proceed to create the loan
      // Insert the loan details into the loans table
      db.query(
        'INSERT INTO loans (customer_id, loan_amount, interest_rate, tenure, monthly_payment, EMIs_paid_on_Time, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? MONTH))',
        [customer_id, loan_amount, correctedInterestRate, tenure, monthly_installment, 0, tenure],
        (err, result) => {
          if (err) {
            console.error('Error creating the loan: ' + err.message);
            return res.status(500).json({ loan_id: null, customer_id, loan_approved: false, message: 'An error occurred while creating the loan.' });
          } else {
            const loan_id = result.insertId;
            return res.status(200).json({
              loan_id,
              customer_id,
              loan_approved: true,
              message: 'Loan created successfully',
              monthly_installment,
            });
          }
        }
      );
    } else {
      // Loan is not approved based on eligibility criteria
      return res.status(200).json({
        loan_id: null,
        customer_id,
        loan_approved: false,
        message: 'Loan not approved based on credit score and other criteria',
        monthly_installment,
      });
    }
  });
};

module.exports = {
  createLoan
};
