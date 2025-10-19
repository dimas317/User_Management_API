import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import cloudinary from './src/config/cloudinary.js';

dotenv.config();

console.log('JWT SECRET:', process.env.JWT_SECRET);
console.log('Cloudinary Loaded:', {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY ? '✅ Exists' : '❌ Missing',
  api_secret: process.env.CLOUDINARY_SECRET ? '✅ Exists' : '❌ Missing',
});

cloudinary.api.ping()
  .then(res => console.log('✅ Cloudinary Connected:', res))
  .catch(err => console.error('❌ Cloudinary Error:', err.message));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Security middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
