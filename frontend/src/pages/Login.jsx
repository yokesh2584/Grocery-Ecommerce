import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Message from "../components/ui/Message";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const { login, loading, error, user } = useAuth(); // 🔥 Watch user instead of isAuthenticated
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) {
      navigate(redirect); // 🔥 Redirect as soon as user state updates
    }
  }, [user, navigate, redirect]); // 🔥 Depend on `user` instead of `isAuthenticated`

  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      await login(email, password);
    } catch (err) {
      setFormError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-page py-3">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={5}>
          <div className="bg-white p-4 p-sm-5 rounded shadow">
            <h1 className="text-center mb-4">
              <FaSignInAlt className="me-2" />
              Sign In
            </h1>

            {error && <Message variant="danger">{error}</Message>}
            {formError && <Message variant="danger">{formError}</Message>}

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Form>

            <Row className="py-3">
              <Col>
                New Customer?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                >
                  Register
                </Link>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
