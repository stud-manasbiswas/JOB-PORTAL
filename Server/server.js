import './config/instrument.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/db.js';
import * as Sentry from '@sentry/node';
import ClerkWebhooks from './controllers/Webhooks.js';
import companyRoutes from './routes/CompanyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoute from './routes/userRoute.js';
import { clerkMiddleware } from '@clerk/express';

// initialize express
const app = express();

// ✅ connect to database and cloudinary
await connectDb();
await connectCloudinary();

// ✅ register Clerk middleware FIRST
app.use(clerkMiddleware());

// other middlewares
app.use(cors());
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));
app.use(express.json());

// routes (safe to use after clerkMiddleware)
app.use('/api/users', userRoute);
app.use('/api/jobs', jobRoutes);
app.use('/api/company', companyRoutes);

// webhook route
app.post('/webhooks', ClerkWebhooks);

// test route
app.get('/', (req, res) => res.send('API Working'));
app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});

// port
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
