import express, { Router } from "express";
import productController from "./controllers/products";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use("", productController());

app.listen(PORT, () =>
  console.log(`Local server is listening on port ${PORT}`)
);
