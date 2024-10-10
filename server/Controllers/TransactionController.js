const axios = require("axios");
const Transaction = require("../Models/Data");

const InsertData = async () => {
  try {
    const response = await axios.get(process.env.DATA_API);
    if (response) {
      const data = response.data;
      await Transaction.insertMany(data);
      res.status(200).send("Data inserted Sucessfully");
    } else {
      console.log("Error While Fetching The Data");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// ========================================================================
const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;
    const transactions = await Transaction.find().skip(skip).limit(limit);
    const totalRecords = await Transaction.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);
    res.json({
      transactions,
      currentPage: parseInt(page),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};
// ========================================================================

const searchTransaction = async (req, res) => {
  const { keyword, page = 1, perPage = 10 } = req.body;
  let query = {};

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalRecords = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / perPage);

    res.json({
      success: true,
      transactions,
      totalPages,
    });
  } catch (error) {
    console.error("Error searching transactions:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching transactions.",
      error: error.message,
    });
  }
};
// ========================================================================
const getStatistics = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }
  try {
    const selectedMonth = parseInt(month);
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, selectedMonth] },
    });
    const totalSaleAmount = transactions
      .filter((transaction) => transaction.sold)
      .reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(
      (transaction) => transaction.sold
    ).length;
    const totalNotSoldItems = transactions.filter(
      (transaction) => !transaction.sold
    ).length;
    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ========================================================================
const getBarChartData = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }
  try {
    const selectedMonth = parseInt(month);
    const transactions = await Transaction.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$dateOfSale" }, selectedMonth] },
          { $eq: ["$sold", true] },
        ],
      },
    });
    const priceRanges = [
      { range: "0 - 100", count: 0 },
      { range: "101 - 200", count: 0 },
      { range: "201 - 300", count: 0 },
      { range: "301 - 400", count: 0 },
      { range: "401 - 500", count: 0 },
      { range: "501 - 600", count: 0 },
      { range: "601 - 700", count: 0 },
      { range: "701 - 800", count: 0 },
      { range: "801 - 900", count: 0 },
      { range: "901-above", count: 0 },
    ];
    transactions.forEach((transaction) => {
      const price = transaction.price;
      switch (true) {
        case price <= 100:
          priceRanges[0].count++;
          break;
        case price <= 200:
          priceRanges[1].count++;
          break;
        case price <= 300:
          priceRanges[2].count++;
          break;
        case price <= 400:
          priceRanges[3].count++;
          break;
        case price <= 500:
          priceRanges[4].count++;
          break;
        case price <= 600:
          priceRanges[5].count++;
          break;
        case price <= 700:
          priceRanges[6].count++;
          break;
        case price <= 800:
          priceRanges[7].count++;
          break;
        case price <= 900:
          priceRanges[8].count++;
          break;
        default:
          priceRanges[9].count++;
          break;
      }
    });
    res.json(priceRanges);
  } catch (error) {
    console.error("Error fetching bar chart data: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ========================================================================
const getPieChartData = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  try {
    const selectedMonth = parseInt(month);
    const transactions = await Transaction.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$dateOfSale" }, selectedMonth] },
          { $eq: ["$sold", true] },
        ],
      },
    });
    const categoryCounts = {};
    transactions.forEach((transaction) => {
      const category = transaction.category;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });
    const pieChartData = Object.entries(categoryCounts).map(
      ([category, count]) => ({
        category,
        count,
      })
    );

    res.json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ========================================================================
const getCombinedData = async (req, res) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }
  try {
    const selectedMonth = parseInt(month);
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, selectedMonth] },
    });
    // ================
    const totalSaleAmount = transactions
      .filter((transaction) => transaction.sold)
      .reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(
      (transaction) => transaction.sold
    ).length;
    const totalNotSoldItems = transactions.filter(
      (transaction) => !transaction.sold
    ).length;
    const stats = {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    };
    // ================
    const barChartData = [
      { range: "0 - 100", count: 0 },
      { range: "101 - 200", count: 0 },
      { range: "201 - 300", count: 0 },
      { range: "301 - 400", count: 0 },
      { range: "401 - 500", count: 0 },
      { range: "501 - 600", count: 0 },
      { range: "601 - 700", count: 0 },
      { range: "701 - 800", count: 0 },
      { range: "801 - 900", count: 0 },
      { range: "901-above", count: 0 },
    ];
    transactions.forEach((transaction) => {
      const price = transaction.price;
      switch (true) {
        case price <= 100:
          barChartData[0].count++;
          break;
        case price <= 200:
          barChartData[1].count++;
          break;
        case price <= 300:
          barChartData[2].count++;
          break;
        case price <= 400:
          barChartData[3].count++;
          break;
        case price <= 500:
          priceRanges[4].count++;
          break;
        case price <= 600:
          barChartData[5].count++;
          break;
        case price <= 700:
          barChartData[6].count++;
          break;
        case price <= 800:
          barChartData[7].count++;
          break;
        case price <= 900:
          barChartData[8].count++;
          break;
        default:
          barChartData[9].count++;
          break;
      }
    });
    // ================
    const categoryCounts = {};
    transactions.forEach((transaction) => {
      const category = transaction.category;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;
    });
    const pieChartData = Object.entries(categoryCounts).map(
      ([category, count]) => ({
        category,
        count,
      })
    );
    const combinedResponse = {
      statistics: stats,
      barChartData: barChartData,
      pieChartData: pieChartData,
    };
    res.json(combinedResponse);
  } catch (error) {
    console.error("Error fetching combined data: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  InsertData,
  getAllTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
  searchTransaction,
};
