require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();
// middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
// Route handlers file require
const user = require("./routes/user");
const product = require("./routes/product");
const order = require("./routes/order");

// middlewares for routes
app.use('/api/v1/',user);
app.use("/api/v1/", product);
app.use("/api/v1/", order);
app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
