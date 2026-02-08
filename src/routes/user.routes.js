const router = require("express").Router();
const { me, updateMe } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middleware");
const { validateBody, userSchemas } = require("../middleware/validation.middleware");

router.get("/profile", auth, me);
router.put("/profile", auth, validateBody(userSchemas.update), updateMe);

module.exports = router;
