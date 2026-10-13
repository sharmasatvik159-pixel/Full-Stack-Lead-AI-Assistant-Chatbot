import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import enquiryRoutes from './routes/enquiryRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import { initDatabase } from './db/connection';
import { seedData } from './db/seed';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Initialize SQLite Database & initial seeds
initDatabase();
seedData();

// 2. Security Middleware: Helmet
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// 3. Security Middleware: CORS
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 4. Security Middleware: Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/', apiLimiter);

// 5. Body Parsers with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// 7. API Health & Info Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DroneTV AI Lead Assistant Backend',
    version: '1.0.0',
    developer: 'Satvik Sharma <sharmasatvik159@gmail.com>'
  });
});

// 8. Mount Domain Routes
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/chatbot', chatbotRoutes);

// 9. 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// 10. Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 DroneTV Lead Assistant Backend Server running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Database: SQLite (dronetv_leads.sqlite)`);
  console.log(`👨‍💻 Developer: Satvik Sharma (sharmasatvik159@gmail.com)`);
  console.log(`====================================================`);
});

export default app;
