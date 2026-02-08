const Joi = require("joi");
const createError = require("../utils/httpError");

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      createError(
        400,
        "Validation error",
        error.details.map((d) => d.message)
      )
    );
  }

  req.body = value;
  next();
};

const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(
      createError(
        400,
        "Validation error",
        error.details.map((d) => d.message)
      )
    );
  }

  req.params = value;
  next();
};

const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const resourceSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    species: Joi.string().valid("dog", "cat", "other").required(),
    age: Joi.number().min(0).required(),
    status: Joi.string().valid("available", "adopted"),
    breed: Joi.string().max(100).required(),
    imageUrl: Joi.string().uri().required(),
    description: Joi.string().max(500).allow("", null),
  }),
  update: Joi.object({
    name: Joi.string(),
    species: Joi.string().valid("dog", "cat", "other"),
    age: Joi.number().min(0),
    status: Joi.string().valid("available", "adopted"),
    breed: Joi.string().max(100),
    imageUrl: Joi.string().uri(),
    description: Joi.string().max(500).allow("", null),
  }).min(1),
  idParam: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

const userSchemas = {
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }).min(1),
};

module.exports = {
  validateBody,
  validateParams,
  authSchemas,
  resourceSchemas,
  userSchemas,
};
