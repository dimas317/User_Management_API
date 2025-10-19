import pool from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { findEmail, create, findID, gettAllUsers, updateByID, deleteByID } from '../models/userModel.js';

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (pw) => pw && pw.length >= 6;

export const getUsers = async (req, res) => {
  try{
    const { rows } = await pool.query('SELECT id, username, email, password, role, avatar_url FROM users');
    res.json(rows);
  }
  catch(err){
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};

export const getUser = async (req, res) => {
  try{
    const { rows } = await pool.query('SELECT id, username, email, password, role, avatar_url FROM users WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  }
  catch(err){
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { username, email } = req.body;
    const query = 'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, password, role, avatar_url';
    const { rows } = await pool.query(query, [username, email, id]);
    res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
}

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();
    const { id } = req.user; // id dari token login

    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [result.secure_url, id]);

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Avatar uploaded successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password, // hash password tampil
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      message: 'User deleted successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
