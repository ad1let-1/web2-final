const Joi = require("joi");
const Pet = require("../models/Pet");

const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

const createPetSchema = Joi.object({
  name: Joi.string().max(100).required(),
  species: Joi.string().valid("dog", "cat", "other").required(),
  breed: Joi.string().max(100).required(),
  age: Joi.number().min(0).required(),
  status: Joi.string().valid("available", "adopted").default("available"),
  imageUrl: Joi.string().uri().required(),
  description: Joi.string().max(500).allow("", null),
});

const updatePetSchema = Joi.object({
  name: Joi.string().max(100),
  species: Joi.string().valid("dog", "cat", "other"),
  breed: Joi.string().max(100),
  age: Joi.number().min(0),
  status: Joi.string().valid("available", "adopted"),
  imageUrl: Joi.string().uri(),
  description: Joi.string().max(500).allow("", null),
}).min(1);

const getAll = async (req, res, next) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json({ pets });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    res.json({ pet });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createPetSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const pet = await Pet.create(value);
    res.status(201).json({ pet });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error: idError } = idParamSchema.validate(req.params);
    if (idError) return res.status(400).json({ message: idError.details[0].message });

    const { error, value } = updatePetSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const pet = await Pet.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    res.json({ pet });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    res.json({ message: "Pet deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
