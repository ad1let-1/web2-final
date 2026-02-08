const router = require("express").Router();
const { auth, adminOnly, userOnly } = require("../middleware/auth.middleware");
const { getAll, getOne, create, update, remove, adopt } = require("../controllers/pet.controller");
const { validateBody, validateParams, resourceSchemas } = require("../middleware/validation.middleware");

router.use(auth);

router.post("/", adminOnly, validateBody(resourceSchemas.create), create);
router.get("/", getAll);
router.get("/:id", validateParams(resourceSchemas.idParam), getOne);
router.put("/:id", adminOnly, validateParams(resourceSchemas.idParam), validateBody(resourceSchemas.update), update);
router.delete("/:id", adminOnly, validateParams(resourceSchemas.idParam), remove);
router.post("/:id/adopt", userOnly, validateParams(resourceSchemas.idParam), adopt);

module.exports = router;
