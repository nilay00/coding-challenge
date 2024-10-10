import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Container } from "react-bootstrap";

const PieChart = ({ month, monthName }) => {
  const [data, setData] = useState([]);

  const fetchValue = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/pie-chart?month=${month}`
      );
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        console.log(response.data);
      } else {
        console.log("No data returned from API");
      }
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, [month]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6699"];

  return (
    <Container>
      <Card className="piechart-card">
        <Card.Body className="piechart">
          <Card.Title className="text-center">
            Pie Chart -{monthName}
          </Card.Title>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PieChart;
