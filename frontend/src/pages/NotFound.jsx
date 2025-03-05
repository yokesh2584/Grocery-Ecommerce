import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={6}>
          <FaExclamationTriangle size={80} className="text-warning mb-4" />
          <h1 className="display-4 mb-4">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-5">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              <FaHome className="me-2" /> Go to Homepage
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
