const express = require('express');
const viewLoanRouter = express.Router();
const {viewLoan} = require('../controllers/viewLoanController');


viewLoanRouter.get('/:loan_id',viewLoan);

module.exports = viewLoanRouter;
