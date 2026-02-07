const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const { getAll, getOne, create, update, remove } = require("../controllers/pet.controller");

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", auth, create);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

module.exports = router;
