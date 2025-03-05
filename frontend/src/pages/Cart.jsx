import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Message from "../components/ui/Message";
import Loader from "../components/ui/Loader";

const Cart = () => {
  const { cart, loading, error, updateQuantity, removeFromCart, getCartTotal } =
    useCart();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  if (loading) return <Loader />;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {error && <Message variant="danger">{error}</Message>}

      {cart.length === 0 ? (
        <Message variant="info">
          <div className="text-center py-4">
            <FaShoppingCart size={50} className="mb-3 text-muted" />
            <h4>Your cart is empty</h4>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/" className="btn btn-primary mt-3">
              Continue Shopping
            </Link>
          </div>
        </Message>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              {cart.map((item) =>
                item.product ? (
                  <ListGroup.Item key={item.product._id || Math.random()}>
                    <Row className="align-items-center">
                      <Col xs={3} md={2}>
                        <Image
                          src={
                            item.product.image
                              ? item.product.image
                              : "/placeholder.svg"
                          }
                          alt={
                            item.product.name ? item.product.name : "No Name"
                          }
                          fluid
                          rounded
                        />
                      </Col>

                      <Col xs={9} md={3}>
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name
                            ? item.product.name
                            : "Unknown Product"}
                        </Link>
                      </Col>

                      <Col md={2} className="text-md-center">
                        $
                        {item.product.price
                          ? item.product.price.toFixed(2)
                          : "0.00"}
                      </Col>

                      <Col xs={6} md={2}>
                        <Form.Control
                          as="select"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.product._id,
                              Number(e.target.value)
                            )
                          }
                        >
                          {[
                            ...Array(
                              item.product.countInStock
                                ? Math.min(item.product.countInStock, 10)
                                : 1
                            ).keys(),
                          ].map((x, index) => (
                            <option key={index} value={x + 1}>
                              {" "}
                              {x + 1}{" "}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>

                      <Col xs={6} md={2} className="text-md-center">
                        $
                        {(item.quantity * (item.product.price || 0)).toFixed(2)}
                      </Col>

                      <Col xs={12} md={1} className="text-md-end">
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ) : null
              )}
            </ListGroup>

            <div className="d-flex mt-4">
              <Link to="/" className="btn btn-outline-secondary">
                <FaArrowLeft className="me-2" /> Continue Shopping
              </Link>
            </div>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items:</Col>
                      <Col className="text-end">
                        ${getCartTotal().toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col className="text-end">
                        {getCartTotal() > 50 ? "Free" : "$10.00"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col className="text-end">
                        ${(getCartTotal() * 0.05).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total:</strong>
                      </Col>
                      <Col className="text-end">
                        <strong>
                          $
                          {(
                            getCartTotal() +
                            (getCartTotal() > 50 ? 0 : 10) +
                            getCartTotal() * 0.05
                          ).toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  type="button"
                  className="btn-block w-100 mt-3"
                  disabled={cart.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Cart;
