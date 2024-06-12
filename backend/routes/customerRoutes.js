const express = require('express');
const { createCustomer, getCustomers } = require('../controllers/customerController');

const router = express.Router();

router.post('/login', createCustomer);
router.get('/', getCustomers);

module.exports = router;
