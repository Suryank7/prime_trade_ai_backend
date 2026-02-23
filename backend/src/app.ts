import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import logger from './config/logger';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import swaggerDocs from './docs/swagger';
import apiRoutes from './routes';

const app: Application = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: true, // Reflects the requesting origin, allowing credentials from any frontend port in dev
  credentials: true,
}));
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// API Routes
app.use('/api/v1', apiRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Prime Trade REST API',
  });
});

// Setup Swagger Docs
swaggerDocs(app, Number(process.env.PORT) || 3000);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
