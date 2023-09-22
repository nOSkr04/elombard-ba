import { Router } from "express";
const router = Router();
import { protect, authorize } from "../middleware/protect.js";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categories.js";

// api/v1/categories/:id/products
import { getCategoryProducts } from "../controller/products.js";
router.route("/:categoryId/products").get(getCategoryProducts);

//"/api/v1/categories"
router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "operator"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

export default router;
