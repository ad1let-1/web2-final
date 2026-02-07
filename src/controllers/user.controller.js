const Joi = require("joi");
const User = require("../models/User");

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6),
}).min(1);

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (value.name) user.name = value.name;
    if (value.email) user.email = value.email;
    if (value.password) user.password = value.password;

    await user.save();

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

module.exports = { me, updateMe };