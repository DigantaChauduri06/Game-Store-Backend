exports.sendCookie = (user,res,responsecode,message = undefined) => {
     const token = user.getJwtToken();
     console.log(token);
     const options = {
       exprires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
       httpOnly: true,
     };
     res.status(responsecode).cookie("token", token, options).json({
       success: true,
       token,
       user,
       message,
     });
}

