import express from 'express';
import { getUsers, getUser, updateProfile, uploadAvatar, deleteUser } from '../controllers/userController.js';
import { verifyToken, ensureSameuser } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUser);
router.put('/:id', verifyToken, ensureSameuser, updateProfile);
router.post('/avatar', verifyToken, upload.single('file'), uploadAvatar);
router.delete('/:id', verifyToken, ensureSameuser, deleteUser);
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  // di sini nanti bisa tambahkan proses simpan ke database

  // 🔥 buat token JWT
  const token = jwt.sign(
    { email }, // payload (data yang disimpan dalam token)
    process.env.JWT_SECRET || 'defaultsecret', // secret key
    { expiresIn: '1d' } // masa berlaku token
  );

  res.status(201).json({
    message: 'User created successfully',
    email,
    token, // kirim token ke client
  });
});

export default router;