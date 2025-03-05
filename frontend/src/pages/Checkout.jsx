"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card, ListGroup } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Message from "../components/ui/Message";
// import { API_URL } from "../config";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [country, setCountry] = useState(user?.country || "");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const shippingCost = getCartTotal() > 50 ? 0 : 10;
  const taxAmount = getCartTotal() * 0.05;
  const totalAmount = getCartTotal() + shippingCost + taxAmount;

  const submitShippingHandler = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const submitPaymentHandler = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        orderItems: cart.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        itemsPrice: getCartTotal(),
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
        totalPrice: totalAmount,
      };

      const res = await axios.post(`http://localhost:5000/api/orders`, orderData);

      // Clear cart after successful order
      clearCart();

      // Redirect to order details page
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="checkout-steps mb-4">
                <div className={`step ${step >= 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <div className="step-text">Shipping</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <div className="step-text">Payment</div>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  <div className="step-number">3</div>
                  <div className="step-text">Place Order</div>
                </div>
              </div>

              {step === 1 && (
                <>
                  <h2>Shipping Address</h2>
                  <Form onSubmit={submitShippingHandler}>
                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="city" className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
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
                            required
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
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit" variant="primary">
                      Continue to Payment
                    </Button>
                  </Form>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Payment Method</h2>
                  <Form onSubmit={submitPaymentHandler}>
                    <Form.Group controlId="paymentMethod" className="mb-3">
                      <Form.Label as="legend">Select Method</Form.Label>
                      <Col>
                        <Form.Check
                          type="radio"
                          label="Credit Card"
                          id="CreditCard"
                          name="paymentMethod"
                          value="Credit Card"
                          checked={paymentMethod === "Credit Card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mb-2"
                        />
                        <Form.Check
                          type="radio"
                          label="PayPal"
                          id="PayPal"
                          name="paymentMethod"
                          value="PayPal"
                          checked={paymentMethod === "PayPal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mb-2"
                        />
                        <Form.Check
                          type="radio"
                          label="Cash on Delivery"
                          id="CashOnDelivery"
                          name="paymentMethod"
                          value="Cash on Delivery"
                          checked={paymentMethod === "Cash on Delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                      </Col>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit" variant="primary">
                        Continue to Review
                      </Button>
                    </div>
                  </Form>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Order Summary</h2>

                  {error && <Message variant="danger">{error}</Message>}

                  <Row>
                    <Col md={6}>
                      <h3>Shipping</h3>
                      <p>
                        <strong>Address:</strong> {address}, {city} {postalCode}
                        , {country}
                      </p>
                    </Col>

                    <Col md={6}>
                      <h3>Payment</h3>
                      <p>
                        <strong>Method:</strong> {paymentMethod}
                      </p>
                    </Col>
                  </Row>

                  <hr />

                  <h3>Order Items</h3>
                  <ListGroup variant="flush">
                    {cart.map((item) => (
                      <ListGroup.Item key={item.product._id}>
                        <Row className="align-items-center">
                          <Col md={2}>
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="img-fluid rounded"
                            />
                          </Col>
                          <Col md={6}>{item.product.name}</Col>
                          <Col md={4} className="text-end">
                            {item.quantity} x ${item.product.price.toFixed(2)} =
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <div className="d-flex gap-2 mt-3">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={placeOrderHandler}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col className="text-end">${getCartTotal().toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col className="text-end">
                      {shippingCost === 0
                        ? "Free"
                        : `$${shippingCost.toFixed(2)}`}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col className="text-end">${taxAmount.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total:</strong>
                    </Col>
                    <Col className="text-end">
                      <strong>${totalAmount.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
