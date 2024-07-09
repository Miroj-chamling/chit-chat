const express = require("express");
const {
  registerUser,
  authUser,
  getAllUsers,
} = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/").post(registerUser).get(protect, getAllUsers);
router.route("/login").post(authUser);

module.exports = router;
