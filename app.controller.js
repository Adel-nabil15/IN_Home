import cors from "cors";
import DBC from "./src/DB/DBC.js";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./src/modules/users/user.controller.js";
import { GlobalError } from "./src/utils/Error/index.js";
import ProductRouter from "./src/modules/product/product.controller.js";
const bootstrap = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.use("/users", UserRouter);
  app.use("/products", ProductRouter);
  DBC();
  app.use(GlobalError);

  app.use((req, res, next) => {
    res.status(404).send("not found");
  });
};

export default bootstrap;
