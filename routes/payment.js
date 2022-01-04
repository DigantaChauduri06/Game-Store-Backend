const router = require('express').Router();
const {
  stripePayment,
  captureStripePayment,
} = require("../controllers/paymentControllers");
const { isLoginedIn, coustomRole } = require("../middleware/user");

router.route("/stripe-pubkey").post(isLoginedIn, stripePayment);

router.route("/payment").post( isLoginedIn,captureStripePayment);

module.exports = router;