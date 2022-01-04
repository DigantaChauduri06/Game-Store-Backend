const router = require("express").Router();
const {
  getAllProducts,
  getSingleProduct,
  addAReview,
  getAReview,
  deleteAReview,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productConntroller");
const { isLoginedIn, coustomRole } = require("../middleware/user");

// User routes
router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);
router
  .route("/review")
  .put(isLoginedIn, addAReview)
  .get(getAReview)
  .delete(isLoginedIn,deleteAReview);
  
// Admin routes
router.route("/admin/addproducts").post(isLoginedIn, coustomRole("admin"), addProduct);
router
  .route("/admin/deleteproduct/:id")
  .delete(isLoginedIn, coustomRole("admin"), deleteProduct);
router.route("/admin/updateproduct/:id")
  .put(isLoginedIn, coustomRole("admin"),updateProduct);
  

module.exports = router;