import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validateRegistration, validateLogin } from '../validators/authValidator.js';

export const register = async (req, res) => {
  try {
    const validatedData = validateRegistration(req.body);
    
    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create(validatedData);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = validateLogin(req.body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user || !(await user.comparePassword(validatedData.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
