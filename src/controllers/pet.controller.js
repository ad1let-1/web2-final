const Pet = require("../models/Pet");
const createError = require("../utils/httpError");

const getAll = async (req, res, next) => {
  try {
    const pets = await Pet.find({ status: "available" }).sort({ createdAt: -1 });
    res.json({ pets });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return next(createError(404, "Pet not found"));

    res.json({ pet });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Forbidden"));
    }
    const pet = await Pet.create(req.body);
    res.status(201).json({ pet });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Forbidden"));
    }
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pet) return next(createError(404, "Pet not found"));

    res.json({ pet });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(createError(403, "Forbidden"));
    }
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return next(createError(404, "Pet not found"));

    res.json({ message: "Pet deleted" });
  } catch (err) {
    next(err);
  }
};

const adopt = async (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return next(createError(403, "Forbidden"));
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) return next(createError(404, "Pet not found"));
    if (pet.status === "adopted") {
      return next(createError(400, "Pet already adopted"));
    }

    pet.status = "adopted";
    pet.adoptedBy = req.user.id;
    await pet.save();

    res.status(200).json({ message: "Pet adopted successfully", pet });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove, adopt };
