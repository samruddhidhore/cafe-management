const calculateBill = (items) => {

  let subtotal = 0;

  const updatedItems = items.map(item => {

    const total = item.price * item.quantity;

    subtotal += total;

    return {
      ...item,
      total
    };
  });

  const gst = subtotal * 0.05;

  const finalTotal = subtotal + gst;

  return {
    updatedItems,
    subtotal,
    gst,
    finalTotal
  };
};

module.exports = calculateBill;