const BigPromice = require("../middleware/BigPromise");
const Product = require("../model/products");
const Order = require("../model/order");
const User = require('../model/user')

exports.check = BigPromice((req, res, next) => {
  res.status(200).json({ message: "message from order controller" });
});
exports.createOrder = BigPromice(async (req, res, next) => {
  const { address, item, paymentInfo, totalAmount } = req.body;
  if (!address || !item || !paymentInfo || !totalAmount) {
      return next(new Error('Please add all info'));
  }

  const order = await Order.create({
    address,
    item,
    paymentInfo,
    totalAmount,
    user: req.user
  });
  res.status(200).json({ success: true, order });
});

exports.deleteOrder = BigPromice(async (req,res,next)=>{
    const orderid = req.params.id;
    const order = Order.findById(orderid);
    if (!order) {
        return next(new Error('No Order found'));
    }
    await order.remove();
    res.status(204).json({msg: 'Deleted'});
});

exports.updateOrder = BigPromice(async(req,res,next) => {
    const order = await Order.findById(req.params.id);
    console.log(order);
    if (!order) {
        return next(new Error('No Order found'));
    }
    const status = req.query.status;
    if (order.orderStatus === 'delivared') {
        return res.status(400).json({msg: 'Already Delivered'});
    } 
    if (order.orderStatus !== 'delivared' && status === 'delivared') {
        order.orderStatus = "delivared";
    }
    await order.save({validationBeforeSave: false});
    res.status(200).json({success: true,order});
});

exports.getOneUserOrder = BigPromice(async(req,res,next) => {
    const userid = req.params.id;
    const user = await User.findById(userid);
    if (!user) {
        return next(new Error('No user found'));
    }
    const order = await Product.find({user: user._id});
    res.status(200).json({success: true,order});
});

exports.adminGetAllOrders = BigPromice(async (req,res,next)=>{
    const orders = await Order.find({});
    console.log(orders);
    res.status(200).json({success: true, orders})
});