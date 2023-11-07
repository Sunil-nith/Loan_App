const express = require('express');
const viewStatementRouter = express.Router();
const {viewStatement} = require('../controllers/viewStatementController');


viewStatementRouter.get('/:customer_id/:loan_id',viewStatement);

module.exports = viewStatementRouter;
