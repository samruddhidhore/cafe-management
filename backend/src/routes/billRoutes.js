const express = require('express');

const router = express.Router();

const {
  generateBill,
  getAllBills
} = require('../controllers/billController');

const router = express.Router();

router.post('/generate', generateBill);

router.get('/all', getAllBills);

module.exports = router;