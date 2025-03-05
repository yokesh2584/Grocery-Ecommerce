"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Badge,
} from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch } from "react-icons/fa";

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/logo.jpg"
            alt="Fresh Mart"
            height="30"
            className="d-inline-block align-top me-2 rounded-circle"
          />
          Fresh Mart
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              <FaSearch />
            </Button>
          </Form>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Nav.Link as={Link} to="/cart">
                    <FaShoppingCart /> Cart
                    {getCartCount() > 0 && (
                      <Badge pill bg="danger" className="ms-1">
                        {getCartCount()}
                      </Badge>
                    )}
                  </Nav.Link>
                )}

                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" />
                      {user?.name}
                    </span>
                  }
                  id="basic-nav-dropdown"
                >
                  {isAdmin ? (
                    <>
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/products">
                        Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/orders">
                        Orders
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/users">
                        Users
                      </NavDropdown.Item>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item as={Link} to="/profile">
                        My Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/orders">
                        My Orders
                      </NavDropdown.Item>
                    </>
                  )}

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
