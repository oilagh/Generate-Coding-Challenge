import express, { Router } from "express";
import productController from "./controllers/product";
import { rateLimit } from "express-rate-limit";

const app = express();

app.set("trust proxy", true);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(limiter);

app.use("", productController());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

export default app;
