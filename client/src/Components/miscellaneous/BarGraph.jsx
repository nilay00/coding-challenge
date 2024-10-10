import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Row } from "react-bootstrap";

const BarGraph = ({ month, monthName }) => {
  const [value, setValue] = useState([]);

  const fetchValue = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bar-chart?month=${month}`
      );
      if (response.data && Array.isArray(response.data)) {
        setValue(response.data);
      } else {
        console.log("No data returned from API");
      }
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, [month]);

  return (
    <Row className="barchart">
      <div class="text-center card-title h5">Bar Chart - {monthName}</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={value}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#0088fe" />
        </BarChart>
      </ResponsiveContainer>
    </Row>
  );
};

export default BarGraph;
