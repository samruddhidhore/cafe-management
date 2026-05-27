const { createBill } = require('../services/billService');

const bills = require('../data/bills');

const generateBill = (req, res) => {

  try {

    const bill = createBill(req.body);

    res.status(201).json({
      success: true,
      data: bill
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllBills = (req, res) => {

  res.status(200).json({
    success: true,
    data: bills
  });
};

module.exports = {
  generateBill,
  getAllBills
};