require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Connection = require("./DB/db");
const TransactionRoutes = require("./Routes/TransactionRoutes");
var app = express();
app.use(express.json());
app.use(cors());

app.use("/api/", TransactionRoutes);
PORT = process.env.PORT;
Connection();
app.listen(PORT || 5000, () => {
  console.log(`App is listing On ${PORT}`);
});
