const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./app");

//Connecting to DB
dotenv.config({ path: "../config.env" });
const db = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log("Connection to db successful");
});

//Server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening to request on port ${port}`);
});
