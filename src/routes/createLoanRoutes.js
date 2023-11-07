const express = require('express');
const createLoanRouter = express.Router();
const {createLoan} = require('../controllers/createLoanController');


createLoanRouter.post('/',createLoan);

module.exports = createLoanRouter;
