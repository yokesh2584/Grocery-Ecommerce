import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Fresh Mart</h5>
            <p className="text-muted">
              Your one-stop shop for fresh groceries and household essentials.
              We deliver quality products right to your doorstep.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-light">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-light">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-light">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-muted">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products"
                  className="text-decoration-none text-muted"
                >
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-muted">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-muted">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/privacy-policy"
                  className="text-decoration-none text-muted"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-muted">
                <FaMapMarkerAlt className="me-2" />
                123 Grocery Street, Food City, FC 12345
              </li>
              <li className="mb-2 text-muted">
                <FaPhone className="me-2" />
                +1 (123) 456-7890
              </li>
              <li className="mb-2 text-muted">
                <FaEnvelope className="me-2" />
                support@freshmart.com
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="bg-secondary" />

        <Row>
          <Col className="text-center text-muted">
            <p className="mb-0">
              &copy; {currentYear} Fresh Mart. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
