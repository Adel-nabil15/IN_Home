import cors from "cors";
import DBC from "./src/DB/DBC.js";
import UserRouter from "./src/modules/users/user.controller.js";
import { GlobalError } from "./src/utils/Error/index.js";
import ProductRouter from "./src/modules/product/product.controller.js";
const bootstrap = (app, express) => {
  // cors oprtions
  const whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://in-home-eight.vercel.app",
    "https://instore-iota.vercel.app",
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    privateNetworkAccess: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  // use cors middleware with options
  app.use(cors(corsOptions));
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
