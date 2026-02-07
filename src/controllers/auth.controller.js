const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/User");
const { env } = require("../config/env");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signToken = (user) => {
  return jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const user = await User.create(value);
    const token = signToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(value.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
