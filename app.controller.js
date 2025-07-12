import cors from "cors";
import DBC from "./src/DB/DBC.js";
import dotenv from "dotenv";
dotenv.config();
import UserRouter from "./src/modules/users/user.controller.js";
import { GlobalError } from "./src/utils/Error/index.js";
import ProductRouter from "./src/modules/product/product.controller.js";
const bootstrap = (app, express) => {
  // cors origin middleware
  // app.use(
  //   cors({
  //     origin: [
  //       "http://localhost:3000",
  //       "http://localhost:5173",
  //       "https://in-home-eight.vercel.app",
  //     ],
  //     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  //     credentials: true,
  //   })
  // );
  const whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://in-home-eight.vercel.app",
  ];
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!whitelist.includes(origin)) {
      return res.status(403).send("Forbidden");
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-private-network", true);
    return next();
  });
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
