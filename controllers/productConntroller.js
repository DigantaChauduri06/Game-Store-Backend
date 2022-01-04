const Product = require("../model/products");
const BigPromise = require("../middleware/BigPromise");
const cloudinary = require('cloudinary').v2;

exports.getAllProducts = BigPromise(async (req, res, next) => {
  let products = await Product.find({});
  const catagory = req.query.catagory;
  if (catagory) {
    products = await Product.find({ catagory: catagory });
  }
  res.status(200).json({
    success: true,
    products,
  });
});

exports.getSingleProduct = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.status(200).json({ success: true, product });
});
//! add/ update review bug has there need to fix
exports.addAReview = BigPromise(async (req, res, next) => {
  let { reviewText, rating } = req.body;
  let id = req.query.id;
  if (reviewText.length > 450 || reviewText.length == 0) {
    return next(new Error("Please write less than 450 words or more than 0"));
  }
  const review = {
    id: req.user_id,
    name: req.user.name,
    rating: Number(rating),
    text: reviewText,
  };
  const product = await Product.findById(id);
  console.log(id);
  const alreadyDone = product.reviews.find(user => {
    user.id.toString() === req.user._id.toString();
  });
  console.log(alreadyDone);
  if (alreadyDone) {
    console.log(alreadyDone);
    for (let ele of product.reviews) {
      if (ele.id.toString() === req.user._id.toString()) {
        ele.text = reviewText;
        await product.save({ validateBeforeSave: false });
        return res.status(201).json({ success: true, product });
      }
    }
  }
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
    product.reviews.push(review);
    await product.save({ validateBeforeSave: false});
    res.status(201).json({success: true, product});
});

exports.getAReview = BigPromise(async (req, res, next) => {
    const review = await Product.findById(req.query.id);
    res.json(200).json({success: true, review});
});
//! Need To Fix this 
exports.deleteAReview = BigPromise(async (req, res, next) => {
    const id = req.query.id;
    let product = await Product.findById(id); 
    // console.log(product.reviews);
    // product = await Product.findByIdAndDelete()

    // console.log(found);
    // console.log(req.user._id);
    product.numOfReviews = product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(204).json({success: true});
});

// admin
exports.addProduct = BigPromise(async (req, res, next) => {
  let imgArray = [];
  if (!req.files) {
    return next(new Error('No Image Found'));
  }
  else {  
    console.log(req.files.photos); 
    // TODO: User Need to add multiple images 
    // for (let i = 0;i < req.files.photos.length;i++) {
        let result = await cloudinary.uploader.upload(
          req.files.photos.tempFilePath,
          {
            folder: "Products_game_store",
          }
        );
      imgArray.push({
        id: result.public_id,
        secure_url: result.secure_url
      })
    // }
    console.log(result);
  }
  req.body.photos = imgArray;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({success:true, product});
});

exports.deleteProduct = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new Error("No Product found with this id"))
  }
  console.log(product.photos[0].id);
  const result = await cloudinary.uploader.destroy(product.photos[0].id);
  console.log(result);
  await product.remove();
  res.status(204).json({success:true, product});
})

exports.updateProduct = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    return next(new Error('Product not found'))
  }
  let imgArray = [];
  if (req.files) {
    console.log(product.photos[0].id);
    const del = await cloudinary.uploader.destroy(product.photos[0].id);
    console.log(del);
    let result = await cloudinary.uploader.upload(
      req.files.photos.tempFilePath,
      {
        folder: "Products_game_store",
      }
    );
    imgArray.push({
      id: result.public_id,
      secure_url: result.secure_url,
    });
    console.log(result);
  }
  req.body.photos = imgArray;
  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({success: true, product: product});
  
})

exports.adminGetAllproducts = BigPromise(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({success: true, products: products});
})