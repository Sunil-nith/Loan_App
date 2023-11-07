const express = require('express');
const makePaymentRouter = express.Router();
const {makePayment} = require('../controllers/makePaymentController');


makePaymentRouter.post('/:customer_id/:loan_id',makePayment);

module.exports = makePaymentRouter;
