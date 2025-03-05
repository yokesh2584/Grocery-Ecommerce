"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Carousel, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";
import Loader from "../components/ui/Loader";
import Message from "../components/ui/Message";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products`, {
          params: { search: searchTerm },
        });

        // console.log("🔹 API Response:", res.data); // Debugging log

        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
          setFilteredProducts(res.data.products);
        } else {
          console.error(
            "❌ API did not return a products array. Response:",
            res.data
          );
          throw new Error("API did not return a products array");
        }
      } catch (err) {
        console.error("🚨 Error fetching products:", err);
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const handleFilter = (filters) => {
    let filtered = Array.isArray(products) ? [...products] : [];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= filters.price.min && product.price <= filters.price.max
    );

    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    setFilteredProducts(filtered);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Carousel className="home-carousel">
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-contain"
                src="/images/banner1.jpg"
                alt="Fresh Vegetables"
              />
              <Carousel.Caption>
                <h2>Fresh Vegetables</h2>
                <p>Farm-fresh vegetables delivered to your doorstep</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-contain"
                src="/images/banner2.jpg"
                alt="Organic Fruits"
              />
              <Carousel.Caption>
                <h2>Organic Fruits</h2>
                <p>100% organic fruits for a healthy lifestyle</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-contain"
                src="/images/banner3.jpg"
                alt="Daily Essentials"
              />
              <Carousel.Caption>
                <h2>Daily Essentials</h2>
                <p>All your daily needs in one place</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h2 className="section-title">Shop by Category</h2>
          <Row>
            {["Fruits", "Vegetables", "Dairy", "Bakery", "Beverages"].map(
              (category) => (
                <Col key={category} xs={6} md={4} lg={2} className="mb-3">
                  <Card className="text-center category-card">
                    <Card.Img
                      variant="top"
                      src={`/images/categories/${category.toLowerCase()}.jpg`}
                      alt={category}
                    />
                    <Card.Body>
                      <Card.Title as="h5">{category}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="section-title">
            {searchTerm ? `Search Results for "${searchTerm}"` : "Our Products"}
          </h2>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <ProductFilter onFilter={handleFilter} />
        </Col>

        <Col lg={9}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : filteredProducts.length === 0 ? (
            <Message variant="info">
              No products found
              {searchTerm && ` for "${searchTerm}"`}
            </Message>
          ) : (
            <Row>
              {/* {console.log("🔹 Filtered Products:", filteredProducts)} */}
              {filteredProducts.map((product) => (
                <Col key={product._id} sm={6} md={4} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
