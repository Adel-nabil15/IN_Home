import express from "express";
import bootstrap from "./app.controller.js";
const app = express();
const port = process.env.PORT || 5000;

bootstrap(app,express);
 

app.listen(port, () => {
  console.log(`server work on port ${port}`);
});
