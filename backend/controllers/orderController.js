const Order = require("../models/order");
const Customer = require("../models/customer");
const { publishMessage,  consumeMessages } = require("../services/pubSubService");

exports.createOrder = async (req, res) => {
  const { customerId, items, amount } = req.body;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.json({ Error: "Invalid Customer" });
    }
    customer.totalSpends += amount;
    customer.numberOfVisits += 1;
    customer.lastVisit = Date.now();
    await customer.save();
    await publishMessage("order",JSON.stringify( { customerId, items, amount }));
    return res.status(201).json({ Sucess: "Order Saved Succesfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customerId");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addOrder = async (log) => {
  try {
    const result = await Order.create(log);
    console.log("Document added successfully:", result);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

consumeMessages("orders", addOrder);
