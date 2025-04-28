import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { connectDB } from "./src/config/database.js";
import path from 'path';
import { fileURLToPath } from 'url';

import errorHandler from "./src/middleware/errorMiddleware.js";

import authRoutes from "./src/routes/authRoutes.js";

//brand owner routes
import brandOwnerProductsRoutes from "./src/routes/brand-owner/products.routes.js";
import brandOwnerBrandRoutes from "./src/routes/brand-owner/brand.routes.js";
import brandManagerTeamRoutes from "./src/routes/brand-manager/team.routes.js";
import buyerMeetingsRoutes from "./src/routes/buyer/meetings.routes.js";
// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Setup request logging - only use morgan in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS setup
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Body parser middleware - must come before routes
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use("/api/auth", authRoutes);

// brand owner Routes
app.use("/api/products", brandOwnerProductsRoutes);
app.use("/api/brand", brandOwnerBrandRoutes);
app.use("/api/team", brandManagerTeamRoutes);
app.use("/api/meetings", buyerMeetingsRoutes);

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to RetailGenie API',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// Error handler middleware should be after routes
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${port}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

startServer();