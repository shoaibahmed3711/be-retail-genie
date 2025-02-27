import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from '../utils/appError.js';
import { User } from "../models/auth/authModel.js";

dotenv.config();

const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    req.user = {
      userId: decoded.userId,
      role: user.role // Add role to req.user
    };

    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

const adminAuth = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Admin access required' });
  }
};

export { protect, adminAuth };
