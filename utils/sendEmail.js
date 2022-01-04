
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
exports.mailHelper = async function (options) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2c2a64c66d31d2",
      pass: "d280fb5781e198",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Diganta Chaudhuri 👻" <digantachaudhuri03@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line -Activateion
    text: "click the below link", // plain text body
    html: `<a href='${options.url}'>click Here</a>`, // html body
  });
}
