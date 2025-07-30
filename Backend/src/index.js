import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import cors from 'cors';
import { app, server } from './libs/socket.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnect } from './libs/db.js';

dotenv.config();

// 🧠 Required for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../Frontend/dist');
  app.use(express.static(frontendPath));

  // ✅ SPA Fallback Route (MUST be last)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  dbConnect();
});
