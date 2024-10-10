import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import "./Graph.css";
const Statis = ({ month, monthName }) => {
  const [stats, setStats] = useState([]);
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/statistics?month=${month}`
      );
      setStats(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchStats();
  }, [month]);
  return (
    <Container>
      <Card className="stats-card">
        <Card.Body className="stats-card-body">
          <Card.Title className="text-center">
            Statistics -{monthName}
          </Card.Title>
          <Row>
            <Col>
              <p>
                <b>Total Sales</b>
              </p>
            </Col>
            <Col>
              <p>{stats.totalSaleAmount}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <b>Total Sold Item</b>
              </p>
            </Col>
            <Col>
              <p>{stats.totalSoldItems}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <b>Total Not Sold Item</b>
              </p>
            </Col>
            <Col>
              <p>{stats.totalNotSoldItems}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Statis;
