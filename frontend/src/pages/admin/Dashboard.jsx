"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
// import { API_URL } from "../../config";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    salesData: {
      labels: [],
      datasets: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/admin/dashboard`);

        // Format sales data for chart
        const salesData = {
          labels: res.data.salesByMonth.map((item) => item.month),
          datasets: [
            {
              label: "Sales",
              data: res.data.salesByMonth.map((item) => item.total),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.1,
            },
          ],
        };

        setStats({
          totalSales: res.data.totalSales,
          totalOrders: res.data.totalOrders,
          totalProducts: res.data.totalProducts,
          totalUsers: res.data.totalUsers,
          recentOrders: res.data.recentOrders,
          salesData,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="dashboard-card bg-primary text-white h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Total Sales</h6>
                  <h2>${stats.totalSales.toFixed(2)}</h2>
                </div>
                <FaDollarSign size={40} opacity={0.5} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="dashboard-card bg-success text-white h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Orders</h6>
                  <h2>{stats.totalOrders}</h2>
                </div>
                <FaShoppingCart size={40} opacity={0.5} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="dashboard-card bg-warning text-white h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Products</h6>
                  <h2>{stats.totalProducts}</h2>
                </div>
                <FaBoxOpen size={40} opacity={0.5} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="dashboard-card bg-danger text-white h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Users</h6>
                  <h2>{stats.totalUsers}</h2>
                </div>
                <FaUsers size={40} opacity={0.5} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Sales Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <Line
                data={stats.salesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Monthly Sales",
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Link
                to="/admin/orders"
                className="btn btn-sm btn-outline-primary"
              >
                View All
              </Link>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <Link to={`/admin/order/${order._id}`}>
                            {order._id.substring(0, 10)}...
                          </Link>
                        </td>
                        <td>{order.user?.name || "Deleted User"}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>
                          {order.isPaid ? (
                            <span className="badge bg-success">Paid</span>
                          ) : (
                            <span className="badge bg-danger">Not Paid</span>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className="badge bg-success">Delivered</span>
                          ) : (
                            <span className="badge bg-danger">
                              Not Delivered
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
