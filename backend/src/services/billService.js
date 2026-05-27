const calculateBill = require('../utils/calculateBill');
const generateBillId = require('../utils/generateBillId');

const bills = require('../data/bills');

const createBill = (data) => {

  const { customerName, tableNo, items } = data;

  const billData = calculateBill(items);

  const bill = {
    billId: generateBillId(),

    customerName,

    tableNo,

    items: billData.updatedItems,

    subtotal: billData.subtotal,

    gst: billData.gst,

    totalAmount: billData.finalTotal,

    createdAt: new Date()
  };

  bills.push(bill);

  return bill;
};

module.exports = {
  createBill
};