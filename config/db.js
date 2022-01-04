const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

module.exports = () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB CONNECTION SUCCESSFUL :-)"))
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
};
