import cors from "cors";
import DBC from "./src/DB/DBC.js";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./src/modules/users/user.controller.js";
import { GlobalError } from "./src/utils/Error/index.js";
import ProductRouter from "./src/modules/product/product.controller.js";
const bootstrap = (app, express) => {
  // cors origin middleware
  app.use(cors());
  // json middleware
  app.use(express.json());
  // users 
  app.use("/users", UserRouter);
  // products 
  app.use("/products", ProductRouter);
  // connect to DB
  DBC();
  // Global Error
  app.use(GlobalError);
  // home page
  app.get("/", (req, res) => {
    res.send("hello in my Inhome App");
  });
  // not found URL
  app.use((req, res, next) => {
    res.status(404).send("not found");
  });
};

export default bootstrap;
