import rateLimit from 'express-rate-limit';

/**
 * Rate limiter untuk sensor data endpoints
 * Max 120 requests per minute per IP (2 requests/second)
 */
export const sensorRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 120, // Max 120 requests per minute
  message: {
    status: 'error',
    message: 'Terlalu banyak request sensor data. Maksimal 120 requests per menit. Coba lagi nanti.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Rate limiter untuk general API endpoints
 * Max 1000 requests per 15 minutes
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // Max 1000 requests per 15 minutes
  message: {
    status: 'error',
    message: 'Terlalu banyak request. Coba lagi dalam 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter untuk authentication endpoints
 * Lebih ketat untuk prevent brute force attacks
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Max 10 login attempts per 15 minutes
  message: {
    status: 'error',
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Reset counter setelah login berhasil
});

export default {
  sensorRateLimiter,
  generalRateLimiter,
  authRateLimiter
};