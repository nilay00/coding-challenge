const express = require("express");
const {
  InsertData,
  getStatistics,
  getAllTransactions,
  getBarChartData,
  getPieChartData,
  getCombinedData,
  searchTransaction,
} = require("../Controllers/TransactionController.js");
const Router = express.Router();
Router.post("/insert", InsertData);
Router.get("/transactions", getAllTransactions);
Router.post("/search", searchTransaction);
Router.get("/statistics", getStatistics);
Router.get("/bar-chart", getBarChartData);
Router.get("/pie-chart", getPieChartData);
Router.get("/all-chart", getCombinedData);

module.exports = Router;
