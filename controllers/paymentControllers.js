const stripe = require("stripe")(process.env.STRIPE_SECRECT_KEY);
const BigPromise = require("../middleware/BigPromise");
const Orders = require('../model/order');

exports.stripePayment = BigPromise(async(req,res,next)=>{
    res.status(200).json({
      stripekey: process.env.STRIPE_PUB_KEY,
    });
});
exports.captureStripePayment = BigPromise(async(req,res,next)=>{
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            payment_method_types: ["card"],
            metadata: {integration_check: 'accept_a_payment'}
        });
        res.status(200).json({paymentIntent})
    }
    catch(e) {
        res.status(404).json({msg: 'Payment failed'})
    }
});
