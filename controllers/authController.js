// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};