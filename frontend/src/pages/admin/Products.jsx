import { useState, useEffect } from "react";
import { Table, Button, Row, Col, Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";
// import { API_URL } from "../../config";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    rating: "",
    numReviews: "",
    countInStock: "",
    description: "",
  });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/products/admin`);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = () => {
    setEditProduct(null);
    setFormData({
      name: "",
      price: "",
      image: "",
      brand: "",
      category: "",
      rating: "",
      numReviews: "",
      countInStock: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      rating: product.rating,
      numReviews: product.numReviews,
      countInStock: product.countInStock,
      description: product.description,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "countInStock" || name === "rating" || name === "numReviews" ? Number(value) : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Store Base64 data
      };
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      setFormLoading(true);

      if (editProduct) {
        await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, formData);
      } else {
        await axios.post(`http://localhost:5000/api/products`, formData);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save product");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="admin-products">
      <Row className="align-items-center mb-3">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleCreateProduct}>
            <FaPlus className="me-2" /> Add Product
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6} className="ms-auto">
          <Form.Group controlId="search">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <Form.Control
                type="text"
                placeholder="Search products..."
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
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>STOCK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  {/* <td>{product._id.substring(0, 10)}...</td> */}
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    {product.countInStock > 0 ? (
                      <span className="text-success">
                        {product.countInStock}
                      </span>
                    ) : (
                      <span className="text-danger">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm me-2"
                      onClick={() => handleEditProduct(product)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Message variant="danger">{formError}</Message>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="price" className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="countInStock" className="mb-3">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter stock quantity"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="file"
                placeholder="Choose image"
                name="image"
                onChange={handleImageChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="brand" className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="category" className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="numReviews" className="mb-3">
                  <Form.Label>Number of Reviews</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the number of reviews"
                    name="numReviews"
                    value={formData.numReviews}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
              <Form.Group controlId="rating" className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={formLoading}
          >
            {formLoading ? "Saving..." : "Save Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
