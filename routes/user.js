const router = require('express').Router();
const {
  dummyRoute,
  signupRoute,
  activateUser,
  loggin,
  logout,
  forgotPassword,
  resetPassword,
  getAllDetails,
  changePassword,
  changeLoggedInUserDetails,
  getAllUsers,
  assignARole,
  deleteAdminUser,
  deleteUser,
} = require("../controllers/userControllers");
const { isLoginedIn, coustomRole } = require("../middleware/user");

router.route('/dummy').get(dummyRoute);
// User route
router.route('/signup').post(signupRoute);
router.route("/user/activate/:token").get(activateUser);
router.route("/login").post(loggin);
router.route("/logout").get( isLoginedIn, logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/user/password/reset/:token").post(resetPassword);
router.route('/user/details').get(isLoginedIn, getAllDetails);
router.route("/user/updateprofile").put(isLoginedIn, changeLoggedInUserDetails);
router.route("/user/update/password").post(isLoginedIn, changePassword);
router.route("/user/deleteuser").delete(isLoginedIn, deleteUser);
// Admins specific routes
router.route("/admin/allusers").get(isLoginedIn, coustomRole('admin'),getAllUsers);
router
  .route("/admin/assign/:id")
  .put(isLoginedIn, coustomRole("admin"), assignARole);
router
  .route("/admin/deleteuser/:id")
  .delete(isLoginedIn, coustomRole("admin"), deleteAdminUser);

module.exports = router;