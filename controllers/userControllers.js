const bcrypt = require("bcryptjs");
const User = require("../model/user");
const BigPromise = require("../middleware/BigPromise");
const { sendCookie } = require("../utils/CookieSend");
const { mailHelper } = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
exports.dummyRoute = (req, res, next) => {
  res.status(200).json({ success: true, message: "Hello from dummy route" });
};

exports.signupRoute = BigPromise(async (req, res, next) => {
  let { name, email, password, confirmPassword, role } = req.body;
  console.log(name, email, password, confirmPassword, role);
  if (!name || !email || !password || !confirmPassword) {
    return next(
      new Error(
        "Please Provide name, email, password, confirmPassword all the details"
      )
    );
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new Error("User Already exists"));
  }
  if (password !== confirmPassword) {
    return next(new Error("password and confirm password is not matched"));
  }
  // password = await bcrypt.hash(password, 10);
  user = User.create({
    name,
    email,
    password,
    confirmPassword,
    role,
  })
    .then(async (user) => {
      const token = user.getJwtToken();
      const myurl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/user/activate/${token}`;
      const options = {
        email: user.email,
        subject: "Activation Email",
        url: myurl,
      };
      try {
        await mailHelper(options);
      } catch (e) {
        user.status = undefined;
        user.save({ validateBeforeSave: false });
        return next(new Error(e.message));
      }
      user.confirmPassword = undefined;
      await user.save({ validateBeforeSave: false });
      sendCookie(user, res, 201);
    })
    .then((status) => {
      console.log("Successfully done.");
    })
    .catch((e) => {
      console.log("Error ", e);
    });
});

exports.activateUser = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRECT);
  req.user = await User.findByIdAndUpdate(decoded.id, { status: "Active" });
  res
    .status(200)
    .json({ message: "Thank You Now You can use your application" });
});

exports.loggin = BigPromise(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("Please Provide email and password to login"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Login First"));
  }
  if (user.status === "Pending") {
    return next(new Error("Please check your email and activate your account"));
  }
  user.comperePassword(password, (err, isMatched) => {
    if (err) console.log("error ", err);
    if (!isMatched) {
      return next(new Error("Passwod does not match"));
    }
    req.user = user;
    console.log(req.user);  
    sendCookie(user, res, 200);
  });
});

exports.logout = BigPromise(async (req, res, next) => {
  req.user = undefined;
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, message: "Logout Success" });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  let { email, newpassword } = req.body;
  if (!email || !newpassword) {
    return next(new Error("email, password and newpassword is required"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found with this email"));
  }
  const token = user.createForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Email part
  const myurl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${token}`;
  const options = {
    email: user.email,
    subject: "Password reset Email",
    url: myurl,
  };
  try {
    await mailHelper(options);
  } catch (e) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpary = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Error(e.message));
  }
  sendCookie(user, res, 200, "successfully sent reset mail");
});
// Take params user forgotPasswordToken from /user/password/reset/${token} and find the user if the user exists and time avalable then only change the password
exports.resetPassword = BigPromise(async (req, res, next) => {
  let { password, confirmpassword } = req.body;
  if (!password || !confirmpassword) {
    return next(new Error("password and confirmpassword is required"));
  }
  const forgotPasswordToken = req.params.token;
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpary: { $gt: Date.now() },
  });
  if (!user) {
    return next(new Error("Forgot Password Token is expired or invalid"));
  }
  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpary = undefined;
  await user.save({ validateBeforeSave: false });
  sendCookie(user, res, 201);
});

exports.getAllDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new Error("User not found with this email"));
  }

  res.status(200).json({ success: true, user });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const { email, password, newpassword } = req.body;
  if (password === newpassword) {
    return next(new Error("New Password and old password should not match"));
  }
  if (!email || !password || !newpassword) {
    return next(new Error("email, password and newpassword is required"));
  }
  let user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found with this email"));
  }
  console.log(user);
  user.password = newpassword;
  await user.save({ validateBeforeSave: false });
  console.log(user);
  sendCookie(user, res, 201);
});

exports.changeLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const id = req.user.id;
  const details = req.body;
  const user = await User.findById(id);
  if (!details) {
    return next(new Error("please provide some filelds to update"));
  }
  if (!user) {
    return next(new Error("User does not exist"));
  }
  user.name = details.name;
  await user.save({ validateBeforeSave: false });
  sendCookie(user, res, 201);
});

exports.deleteUser = BigPromise(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("No User found"));
  }
  await user.remove();
  res.status(204).json({ success: true });
});

// Admin
exports.deleteAdminUser = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("No User found"));
  }
  await user.remove();
  res.status(204).json({ success: true });
});
exports.getAllUsers = BigPromise(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});
exports.assignARole = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!req.body.role) {
    return next(new Error("No role specified in the body"));
  }
  if (!user) {
    return next(new Error("No User found"));
  }
  user.role = req.body.role;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, user });
});
