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
import { validation } from "../../middleware/validation.js";
import { addProductSchema,updateProductSchema } from "./product.validation.js";
const ProductRouter = Router();
// ===========================================================================
ProductRouter.post("/addProduct",validation(addProductSchema), Authentication, Authorization(["superadmin", "admin"]), addProduct);
ProductRouter.get("/getProducts", Authentication, getProducts);
ProductRouter.get("/getOneProduct/:id", Authentication, getOneProduct);
ProductRouter.patch("/updateProduct/:id",validation(updateProductSchema), Authentication, Authorization(["superadmin", "admin"]), updateProduct);
ProductRouter.delete("/deleteProduct/:id", Authentication,Authorization(["superadmin"]), deleteProduct);
ProductRouter.get("/exportProductsToExcel", Authentication,Authorization(["superadmin" ]), exportProductsToExcel); 
// ===========================================================================


export default ProductRouter;
