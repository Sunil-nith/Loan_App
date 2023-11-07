const express = require('express');
const ingestDatarouter = express.Router();
const {ingestData} = require('../controllers/ingestDataController');


ingestDatarouter.post('/',ingestData);

module.exports = ingestDatarouter;
