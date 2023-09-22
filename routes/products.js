import { Router } from "express";
import { protect, authorize } from "../middleware/protect.js";

import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadProductPhoto,
} from "../controller/products.js";

const router = Router();

//"/api/v1/products"
router
  .route("/")
  .get(protect, getProducts)
  .post(protect, authorize("admin", "operator"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .delete(protect, authorize("admin", "operator"), deleteProduct)
  .put(protect, authorize("admin", "operator"), updateProduct);

router
  .route("/:id/upload-photo")
  .put(protect, authorize("admin", "operator"), uploadProductPhoto);

export default router;
