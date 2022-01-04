const jwt = require('jsonwebtoken');
const BigPromise = require('./BigPromise');
const User = require('../model/user')

exports.isLoginedIn = BigPromise(async (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer', '') || req.body?.token;
    if (!token) {
        return next(new Error('Please Login First')); 
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);
    let user = await User.findById(decoded.id);
    if (!user) {
        return next(new Error('id is not matching'));
    }
    req.user = user;
    next();
});

exports.coustomRole = (...roles) => {
  // here we treating maneger or admin as a array as array has many methods to do
  return BigPromise((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not allowed to access this resource."));
    }
    next();
  });
}