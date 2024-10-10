import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Statis from "./miscellaneous/Stats";
import BarGraph from "./miscellaneous/BarGraph";
import PieChart from "./miscellaneous/PieChart";
import "./Component.css";
const Home = () => {
  const [month, setMonth] = useState(3);
  const [monthName, setMonthName] = useState("March");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchQuery]);

  const fetchTransactions = async () => {
    try {
      const params = { page: currentPage };
      let response;
      if (searchQuery) {
        response = await axios.post("http://localhost:5000/api/search", {
          keyword: searchQuery,
          page: currentPage,
          perPage: 10,
        });
      } else {
        response = await axios.get("http://localhost:5000/api/transactions", {
          params,
        });
      }
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleMonthChange = (e) => {
    const selectedMonthValue = parseInt(e.target.value, 10);
    const selectedMonth = months.find(
      (month) => month.value === selectedMonthValue
    );
    setMonth(selectedMonthValue);
    setMonthName(selectedMonth?.name || "");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <Container fluid>
      <Container className="secondary">
        <Row className="mb-3 top">
          <Col>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="search"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Form>
          </Col>
          <Col></Col>
          <Col></Col>
          <Col>
            <Form.Select id="month" value={month} onChange={handleMonthChange}>
              {months.map((m) => (
                <option key={m.value} value={m.value} name={m.name}>
                  {m.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <Statis month={month} monthName={monthName} />
          </Col>
          <Col>
            <BarGraph month={month} monthName={monthName} />
          </Col>
          <Col>
            <PieChart month={month} monthName={monthName} />
          </Col>
        </Row>
        <Table striped bordered hover className="data-table responsive">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold == true ? "Sold" : "Not Sold"}</td>
                  <td>
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      width="100"
                      height="100"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center align-item-center mb-5">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn btn-primary"
          >
            Previous
          </button>
          <span className="mt-1">
            &nbsp; &nbsp; Page {currentPage} of {totalPages}&nbsp; &nbsp;
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>
      </Container>
    </Container>
  );
};

export default Home;
