const db = require('../../db/db'); // Import your database module

// Function to make a payment towards an EMI
const makePayment = (req, res) => {
    const { customer_id, loan_id } = req.params;
    const { paymentAmount } = req.body;
    // Fetch loan details from the database
    db.query('SELECT * FROM loans WHERE loan_id = ?', [loan_id], (err, rows) => {
        if (err) {
            console.error('Error fetching loan details: ' + err.message);
            return res.status(500).json({ message: 'An error occurred while fetching loan details' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        const loan = rows[0];
        const { loan_amount, tenure, interest_rate } = loan;
        let EMIs_paid = loan.EMIs_paid;
        let amount_paid = loan.amount_paid;
        let monthly_payment = loan.monthly_payment;

        if (paymentAmount !== monthly_payment) {
            const remaining_amount = loan_amount - (paymentAmount - amount_paid);
            const monthlyInterestRate = interest_rate / 12 / 100;
            const newMonthly_installment = (
                (remaining_amount * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -(tenure - EMIs_paid)))
            );
            monthly_payment = newMonthly_installment.toFixed(2);
        }

        amount_paid = amount_paid + paymentAmount;
        EMIs_paid = EMIs_paid + 1;

        // Update the EMI amount in the database
        db.query('UPDATE loans SET monthly_payment = ?, amount_paid = ?,EMIs_paid = ? WHERE loan_id = ?', [monthly_payment, amount_paid, EMIs_paid, loan_id], (err) => {
            if (err) {
                console.error('Error updating EMI amount and EMIs_paid: ' + err.message);
                return res.status(500).json({ message: 'An error occurred while updating EMI amount' });
            }
            res.status(200).json({
                message: 'Payment successful',
                "Next_Emi": monthly_payment
            });
        });
    }

    );
};

module.exports = {
    makePayment,
};