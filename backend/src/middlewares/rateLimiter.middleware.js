import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

const customErrorHandler = (req, res, next, options) => {
  const error = new ApiError(options.statusCode, options.message);
  next(error);
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: "Too many login attempts! Try again in 15 minutes.",
  handler: customErrorHandler,
});

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: "Too many comment attempts. Try again in a minute.",
  handler: customErrorHandler,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: "Too many requests! Try again in 15 minutes.",
  handler: customErrorHandler,
});
