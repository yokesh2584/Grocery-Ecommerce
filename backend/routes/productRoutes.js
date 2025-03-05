import express from "express";
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts, getFeaturedProducts, getProductCategories, getAdminProducts } from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/top").get(getTopProducts);
router.route("/featured").get(getFeaturedProducts);
router.route("/categories").get(getProductCategories);
router.route("/admin").get(protect, admin, getAdminProducts);
router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;