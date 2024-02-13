const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      user = new User({ username, email, password });
      await user.save();
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.loginUser = async (req, res) => {
    try {
      
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User with this email does not exist' });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated. Please contact the administrator.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ token, role: user.role });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }