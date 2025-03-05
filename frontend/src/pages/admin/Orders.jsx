"use client";

import { useState, useEffect } from "react";
import { Table, Button, Badge, Row, Col, Form } from "react-bootstrap";
import { FaEye, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
// import { API_URL } from "../../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/orders/admin`);
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by search term
    const searchMatch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name &&
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email &&
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by status
    let statusMatch = true;
    if (filterStatus === "paid") {
      statusMatch = order.isPaid;
    } else if (filterStatus === "unpaid") {
      statusMatch = !order.isPaid;
    } else if (filterStatus === "delivered") {
      statusMatch = order.isDelivered;
    } else if (filterStatus === "not-delivered") {
      statusMatch = !order.isDelivered;
    }

    return searchMatch && statusMatch;
  });

  return (
    <div className="admin-orders">
      <h1>Orders</h1>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="filterStatus">
            <Form.Select
              value={filterStatus}
              onChange={handleFilterChange}
              className="form-select-sm"
            >
              <option value="all">All Orders</option>
              <option value="paid">Paid Orders</option>
              <option value="unpaid">Unpaid Orders</option>
              <option value="delivered">Delivered Orders</option>
              <option value="not-delivered">Not Delivered Orders</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="search">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <Form.Control
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : filteredOrders.length === 0 ? (
        <Message variant="info">No orders found</Message>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 10)}...</td>
                  <td>
                    {order.user ? order.user.name : "Deleted User"}
                    <br />
                    <small className="text-muted">
                      {order.user ? order.user.email : ""}
                    </small>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <Badge bg="success">
                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge bg="danger">Not Paid</Badge>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <Badge bg="success">
                        Delivered on{" "}
                        {new Date(order.deliveredAt).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge bg="danger">Not Delivered</Badge>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        <FaEye /> Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Orders;
