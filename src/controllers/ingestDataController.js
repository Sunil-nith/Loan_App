const xlsx = require('xlsx');
const db = require('../../db/db');
require('../../db/create-tables');

function excelSerialToDate(serial) {
  if (typeof serial === 'number') {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const date = new Date(utcValue * 1000);
    return date.toISOString().split('T')[0];
  }
  return null;
}
const ingestData = (req, res) => {
  try {
    const customerData = xlsx.readFile('customer_data.xlsx');
    const loanData = xlsx.readFile('loan_data.xlsx');
    const customers = xlsx.utils.sheet_to_json(customerData.Sheets['Sheet1']);
    const loans = xlsx.utils.sheet_to_json(loanData.Sheets['Sheet1']);

    customers.forEach((customer) => {
      const query = 'INSERT INTO customers SET ?';
      db.query(query, customer, (err, result) => {
        if (err) {
          console.error('Error inserting customer data: ' + err.message);

        }
      });
    });

    loans.forEach((loan) => {
      loan.start_date = excelSerialToDate(loan.start_date);
      loan.end_date = excelSerialToDate(loan.end_date);
      const query = 'INSERT INTO loans SET ?';
      db.query(query, loan, (err, result) => {
        if (err) {
          console.error('Error inserting loan data: ' + err.message);
        }
      });
    });

    res.status(200).send('Data ingestion completed');
  } catch (error) {
    console.error('Error processing data: ' + error.message);
    res.status(500).json({ error: 'Data ingestion process failed' });
  }
};

module.exports = {
  ingestData,
};