require("dotenv").config();
const app = require("./app");
const databaseConnection = require('./config/db');
const { PORT } = process.env;

databaseConnection();

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
