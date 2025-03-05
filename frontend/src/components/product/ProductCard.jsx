import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Rating from "../ui/Rating";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card className="h-100 product-card">
      <Link to={`/product/${product._id}`}>
        {/* {console.log("🖼️ Product Image Data:", product.image)}; */}
        <Card.Img
          variant="top"
          src={product.image ?? "/images/placeholder.jpg"}
          alt={product.name}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="h5" className="product-title">
            {product.name}
          </Card.Title>
        </Link>

        <div className="mb-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>

        <Card.Text className="product-category text-muted mb-2">
          {product.category}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Card.Text className="product-price fw-bold">
            ${product.price.toFixed(2)}
          </Card.Text>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
