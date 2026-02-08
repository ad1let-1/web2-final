const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const User = require("../models/User");
const createError = require("../utils/httpError");

const auth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return next(createError(401, "Missing token"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (!payload.role) {
      const user = await User.findById(payload.id).select("role");
      if (!user) return next(createError(401, "Invalid token"));
      req.user = { id: payload.id, role: user.role };
      return next();
    }
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return next(createError(401, "Invalid token"));
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(createError(403, "Forbidden"));
  }
  next();
};

const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return next(createError(403, "Forbidden"));
  }
  next();
};

module.exports = { auth, adminOnly, userOnly };
