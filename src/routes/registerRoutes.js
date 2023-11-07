const express = require('express');
const registerCustomerRouter = express.Router();
const {registerCustomer} = require('../controllers/registerController');


registerCustomerRouter.post('/',registerCustomer);

module.exports = registerCustomerRouter;
