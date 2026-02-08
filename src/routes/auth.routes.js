const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const { validateBody, authSchemas } = require("../middleware/validation.middleware");

router.post("/register", validateBody(authSchemas.register), register);
router.post("/login", validateBody(authSchemas.login), login);

module.exports = router;
