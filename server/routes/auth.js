import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validate
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  try {
    // 2. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // 3. Hash password (never store plain text)
    const hashed = await bcrypt.hash(password, 10);

    // 4. Save user
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Register failed', detail: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'All fields required' });

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // 2. Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // 3. Generate token
    const token = jwt.sign(
      { id: user._id },           // payload — what's inside the token
      process.env.JWT_SECRET,     // secret — used to sign + verify
      { expiresIn: '7d' }         // expiry
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

export default router;