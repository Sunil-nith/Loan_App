const express = require('express');
const checkEligibilityRouter = express.Router();
const {mainFunction} = require('../controllers/checkEligibilityController');


checkEligibilityRouter.post('/',mainFunction);

module.exports = checkEligibilityRouter;
