const express = require("express");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import middleware

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ Protected Route Example (Requires JWT)
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ msg: "You are authorized!", userId: req.user });
});

module.exports = router;
