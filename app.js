import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { connectDB } from "./src/config/database.js";

import errorHandler from "./src/middleware/errorMiddleware.js";

import authRoutes from "./src/routes/authRoutes.js";

//brand owner routes
import brandOwnerProductsRoutes from "./src/routes/brand-owner/products.routes.js";
import brandOwnerBrandRoutes from "./src/routes/brand-owner/brand.routes.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(errorHandler);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// brand owner Routes
app.use("/api/products", brandOwnerProductsRoutes);
app.use("/api/brand", brandOwnerBrandRoutes);


// Handle 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();