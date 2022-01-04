const router = require("express").Router();
const { isLoginedIn, coustomRole } = require("../middleware/user");
const {check, createOrder, deleteOrder, updateOrder, getOneUserOrder, adminGetAllOrders} = require('../controllers/orderControlletr');

router.route('/check').get(check);
router.route("/createorder").post(isLoginedIn, createOrder);
router.route("/updateorder/:id").put(isLoginedIn, updateOrder);
router.route("/deleteorder/:id").delete(isLoginedIn, deleteOrder);

router.route("/getorder/:id").get(isLoginedIn, getOneUserOrder);
router.route("/admin/getorders").get(isLoginedIn,coustomRole("admin"), adminGetAllOrders);

module.exports = router;