"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Tab,
  Nav,
} from "react-bootstrap";
import { FaUser, FaShoppingBag, FaAddressCard } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Message from "../components/ui/Message";
import Loader from "../components/ui/Loader";
// import { API_URL } from "../config";

const Profile = () => {
  const { user, updateProfile, loading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setPostalCode(user.postalCode || "");
      setCountry(user.country || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await axios.get(`http://localhost:5000/api/orders/myorders`);
        setOrders(res.data);
      } catch (err) {
        setOrdersError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (password && password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const userData = {
        name,
        email,
        address,
        city,
        postalCode,
        country,
      };

      if (password) {
        userData.password = password;
      }

      await updateProfile(userData);
      setSuccessMessage("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <Tab.Container id="profile-tabs" defaultActiveKey="profile">
        <Row>
          <Col md={3} className="mb-4">
            <Card>
              <Card.Body>
                <div className="text-center mb-3">
                  <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <h4 className="mt-2">{user?.name}</h4>
                  <p className="text-muted">{user?.email}</p>
                </div>

                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">
                      <FaUser className="me-2" /> Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders">
                      <FaShoppingBag className="me-2" /> Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="address">
                      <FaAddressCard className="me-2" /> Address
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card>
                  <Card.Header>
                    <h3>User Information</h3>
                  </Card.Header>
                  <Card.Body>
                    {error && <Message variant="danger">{error}</Message>}
                    {formError && (
                      <Message variant="danger">{formError}</Message>
                    )}
                    {successMessage && (
                      <Message variant="success">{successMessage}</Message>
                    )}

                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter password (leave blank to keep current)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group controlId="confirmPassword" className="mb-4">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="orders">
                <Card>
                  <Card.Header>
                    <h3>My Orders</h3>
                  </Card.Header>
                  <Card.Body>
                    {ordersLoading ? (
                      <Loader />
                    ) : ordersError ? (
                      <Message variant="danger">{ordersError}</Message>
                    ) : orders.length === 0 ? (
                      <Message variant="info">You have no orders</Message>
                    ) : (
                      <ListGroup variant="flush">
                        {orders.map((order) => (
                          <ListGroup.Item key={order._id}>
                            <Row>
                              <Col md={2}>
                                <strong>Order ID:</strong>
                              </Col>
                              <Col md={10}>
                                <a href={`/order/${order._id}`}>{order._id}</a>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={2}>
                                <strong>Date:</strong>
                              </Col>
                              <Col md={10}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Col>
                            </Row>
                            <Row>
                              <Col md={2}>
                                <strong>Total:</strong>
                              </Col>
                              <Col md={10}>${order.totalPrice.toFixed(2)}</Col>
                            </Row>
                            <Row>
                              <Col md={2}>
                                <strong>Status:</strong>
                              </Col>
                              <Col md={10}>
                                {order.isPaid ? (
                                  <span className="text-success">Paid</span>
                                ) : (
                                  <span className="text-danger">Not Paid</span>
                                )}
                                {" | "}
                                {order.isDelivered ? (
                                  <span className="text-success">
                                    Delivered
                                  </span>
                                ) : (
                                  <span className="text-danger">
                                    Not Delivered
                                  </span>
                                )}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="address">
                <Card>
                  <Card.Header>
                    <h3>Shipping Address</h3>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="address" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group controlId="city" className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group controlId="postalCode" className="mb-3">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter postal code"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="country" className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter country"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Address"}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Profile;
