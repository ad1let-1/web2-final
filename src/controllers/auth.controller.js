const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../config/env");
const createError = require("../utils/httpError");

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return next(createError(400, "Email already in use"));

    const user = await User.create(req.body);
    const token = signToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(401, "Invalid credentials"));

    const ok = await user.comparePassword(req.body.password);
    if (!ok) return next(createError(401, "Invalid credentials"));

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
