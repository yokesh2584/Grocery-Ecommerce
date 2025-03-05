"use client";

import { useState, useEffect } from "react";
import { Form, Button, Accordion } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
// import { API_URL } from "../../config";

const ProductFilter = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handlePriceChange = (e, type) => {
    const value = Number.parseInt(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleRatingChange = (e) => {
    setRating(Number.parseInt(e.target.value));
  };

  const handleApplyFilter = () => {
    onFilter({
      categories: selectedCategories,
      price: priceRange,
      rating,
    });
  };

  const handleResetFilter = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 100 });
    setRating(0);
    onFilter({
      categories: [],
      price: { min: 0, max: 100 },
      rating: 0,
    });
  };

  return (
    <div className="product-filter mb-4">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <FaFilter className="me-2" /> Filter Products
          </Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Categories</Form.Label>
                {loading ? (
                  <p>Loading categories...</p>
                ) : (
                  categories.map((category) => (
                    <Form.Check
                      key={category}
                      type="checkbox"
                      id={`category-${category}`}
                      label={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mb-1"
                    />
                  ))
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Price Range</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="number"
                    min="0"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, "min")}
                    size="sm"
                  />
                  <span>to</span>
                  <Form.Control
                    type="number"
                    min={priceRange.min}
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, "max")}
                    size="sm"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Minimum Rating</Form.Label>
                <Form.Range
                  min="0"
                  max="5"
                  step="1"
                  value={rating}
                  onChange={handleRatingChange}
                />
                <div className="text-end">{rating} stars & above</div>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleApplyFilter}
                  className="flex-grow-1"
                >
                  Apply Filters
                </Button>
                <Button variant="outline-secondary" onClick={handleResetFilter}>
                  Reset
                </Button>
              </div>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ProductFilter;
