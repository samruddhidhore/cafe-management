const generateBillId = () => {

  return `BILL-${Date.now()}`;
};

module.exports = generateBillId;