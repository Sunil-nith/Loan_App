const db = require('../../db/db');

function calculateCreditScore(customerId, callback) {
  let creditScore = 100;

  // Step 1: Calculate the number of loans
  db.query('SELECT COUNT(*) AS totalLoans FROM loans WHERE customer_id = ?', [customerId], (err, rows) => {
    if (err) {
      console.error('Error calculating number of loans: ' + err.message);
      return callback({ error: 'Failed to calculate credit score' });
    }

    if (rows.length > 0) {
      const numLoans = rows[0].totalLoans;

      // Step 2: Calculate the component score for the number of loans
      const componentScoreForNumLoans = Math.min(numLoans * 15, 50);

      // Step 3: Deduct the component score from the credit score
      creditScore -= componentScoreForNumLoans;

      // Component i: Past Loans paid on time
      db.query('SELECT COUNT(*) AS loansPaidOnTime FROM loans WHERE customer_id = ? AND EMIs_paid_on_Time = tenure', [customerId], (err, rows) => {
        if (err) {
          console.error('Error calculating loans paid on time: ' + err.message);
          return callback({ error: 'Failed to calculate credit score' });
        }

        if (rows.length > 0) {
          const loansPaidOnTime = rows[0].loansPaidOnTime;

          // Step 2: Calculate the component score for loans paid on time with a maximum of 20 points
          const componentScoreForLoansPaidOnTime = Math.floor((loansPaidOnTime / numLoans) * 20);

          // Step 3: Add the component score to the credit score
          creditScore += componentScoreForLoansPaidOnTime;

          // Component iii: Loan Activity in the Current Year
          const currentYear = new Date().getFullYear();
          db.query('SELECT COUNT(*) AS currentYearLoans FROM loans WHERE customer_id = ? AND YEAR(start_date) = ?', [customerId, currentYear], (err, rows) => {
            if (err) {
              console.error('Error calculating loans in the current year: ' + err.message);
              return callback({ error: 'Failed to calculate credit score' });
            }

            if (rows.length > 0) {
              const loansInCurrentYear = rows[0].currentYearLoans;

              // Step 2: Calculate the component score for loans in the current year with a maximum of 10 points
              const componentScoreForLoansInCurrentYear = Math.min(loansInCurrentYear * 5, 10);

              // Step 3: Deduct the component score from the credit score
              creditScore -= componentScoreForLoansInCurrentYear;

              // Component iv: Loan Approved Volume
              db.query('SELECT SUM(loan_amount) AS totalApprovedVolume FROM loans WHERE customer_id = ?', [customerId], (err, rows) => {
                if (err) {
                  console.error('Error calculating total approved volume: ' + err.message);
                  return callback({ error: 'Failed to calculate credit score' });
                }

                if (rows.length > 0) {
                  const totalApprovedVolume = rows[0].totalApprovedVolume;

                  // Component v: Comparison with Approved Limit
                  db.query('SELECT approved_limit FROM customers WHERE customer_id = ?', [customerId], (err, rows) => {
                    if (err) {
                      console.error('Error fetching approved limit: ' + err.message);
                      return callback({ error: 'Failed to calculate credit score' });
                    }

                    if (rows.length > 0) {
                      const approvedLimit = rows[0].approved_limit;

                      // Step 2: Calculate the sum of current loans (you need to query the current loans and calculate the sum)
                      // Replace with the actual sum of current loans
                      // For now, we assume the sumOfCurrentLoans is calculated and provided

                      // Step 3: Compare the sum of current loans with the approved limit
                      if (totalApprovedVolume >= approvedLimit) {
                        creditScore = 0;
                      } else {
                        const component = Math.floor((totalApprovedVolume / approvedLimit) * 20);
                        creditScore -= component;
                      }

                      // Return the credit score when all components are calculated
                      callback(creditScore);
                    } else {
                      callback({ error: 'Customer\'s approved limit not found' });
                    }
                  });
                } else {
                  callback({ error: 'Total approved volume not found' });
                }
              });
            } else {
              callback({ error: 'Loans in the current year not found' });
            }
          });
        } else {
          callback({ error: 'Loans paid on time not found' });
        }
      });
    } else {
      callback({ error: 'Total loans not found' });
    }
  });
}

// Function to check loan eligibility
const checkEligibility = (customer_id, loan_amount, interest_rate, tenure, callback) => {
  // Calculate the customer's credit score
  calculateCreditScore(customer_id, (creditScore) => {
    if (creditScore.error) {
      return callback(creditScore); // Pass along the error
    }

    // Initialize response variables
    let approval = false;
    let correctedInterestRate = interest_rate; // Default to the original interest rate

    // Determine loan eligibility based on credit score and other criteria
    if (creditScore > 50) {
      // If the credit score is higher than 50, approve the loan
      approval = true;
    } else if (creditScore > 30) {
      // If the credit score is between 30 and 50
      if (interest_rate >= 12) {
        // If the interest rate is higher than 12%, approve the loan
        approval = true;
      } else {
        // If the interest rate is not higher than 12%, correct it to 12%
        correctedInterestRate = 12;
      }
    } else if (creditScore > 10) {
      // If the credit score is between 10 and 30
      if (interest_rate >= 16) {
        // If the interest rate is higher than 16%, approve the loan
        approval = true;
      } else {
        // If the interest rate is not higher than 16%, correct it to 16%
        correctedInterestRate = 16;
      }
    }

    // Check if sum of all current EMIs > 50% of monthly salary
    db.query('SELECT monthly_salary FROM customers WHERE customer_id = ?', [customer_id], (err, rows) => {
      if (err) {
        console.error('Error fetching monthly salary: ' + err.message);
        return callback({ error: 'Failed to check loan eligibility' });
      }

      if (rows.length > 0) {
        const monthlySalary = rows[0].monthly_salary;

        db.query('SELECT SUM(monthly_payment) AS sumOfCurrentEMIs FROM loans WHERE customer_id = ? AND end_date >= NOW()', [customer_id], (err, rows) => {
          if (err) {
            console.error('Error calculating sum of current EMIs: ' + err.message);
            return callback({ error: 'Failed to check loan eligibility' });
          }

          if (rows.length > 0) {
            const sumOfCurrentEMIs = rows[0].sumOfCurrentEMIs;

            if (sumOfCurrentEMIs > 0.5 * monthlySalary) {
              approval = false;
            }

            const monthlyInterestRate = correctedInterestRate / 12 / 100;

            // Calculate the monthly installment (EMI)
            const monthly_installment = (
              (loan_amount * monthlyInterestRate) /
              (1 - Math.pow(1 + monthlyInterestRate, -tenure))
            );

            // Round the result to two decimal places
            const rounded_monthly_installment = monthly_installment.toFixed(2);

            // Respond with the eligibility results
            callback({
              customer_id,
              approval,
              creditScore,
              interest_rate,
              correctedInterestRate,
              tenure,
              monthly_installment: rounded_monthly_installment,
            });
          } else {
            callback({ error: 'Sum of current EMIs not found' });
          }
        });
      } else {
        callback({ error: 'Monthly salary not found' });
      }
    });
  });
}

const mainFunction = (req, res) => {
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;

  checkEligibility(customer_id, loan_amount, interest_rate, tenure, (eligibilityData) => {
    if (eligibilityData.error) {
      return res.status(500).json({ error: eligibilityData.error });
    }

    const { approval, correctedInterestRate, tenure, monthly_installment } = eligibilityData;
    res.status(200).json({
      customer_id,
      approval,
      interest_rate,
      correctedInterestRate,
      tenure,
      monthly_installment,
    });
  });
}

module.exports = {
  checkEligibility,
  mainFunction,
};
