// server.js
import './config/instrument.js'; // initializes Sentry
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import * as Sentry from '@sentry/node';
import pkg from '@sentry/integrations';
import connectDb from './config/db.js';
import clerkWebhooks from './controllers/Webhooks.js';

const { Http } = pkg;

// 1. Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Http({ tracing: true })],
  tracesSampleRate: 1.0,
});

// 2. Init express
const app = express();

// 3. Connect MongoDB
await connectDb();

// 4. Request handler must come *before* your routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 5. Express middlewares
app.use(cors());
app.use(express.json());

// 6. Routes
app.get('/', (req, res) => res.send('✅ API Working'));

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

app.post('/webhooks', clerkWebhooks);

// 7. Sentry error handler (after all routes)
app.use(Sentry.Handlers.errorHandler());

// 8. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
