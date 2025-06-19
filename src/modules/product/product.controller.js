import Router from "express";
import {
  addProduct,
  updateProduct,
  getProducts,
  getOneProduct,
  deleteProduct,
  exportProductsToExcel,
} from "./product.service.js";
import { Authentication, Authorization } from "../../middleware/Auth.js";
const ProductRouter = Router();

ProductRouter.post("/addProduct", Authentication, addProduct);
ProductRouter.get("/getProducts", Authentication, getProducts);
ProductRouter.get("/getOneProduct/:id", Authentication, getOneProduct);
ProductRouter.patch("/updateProduct/:id", Authentication, updateProduct);
ProductRouter.delete("/deleteProduct/:id", Authentication, deleteProduct);
ProductRouter.get("/exportProductsToExcel", exportProductsToExcel);

export default ProductRouter;
