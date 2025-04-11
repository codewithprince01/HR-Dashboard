const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


router.post("/logout", authMiddleware.verifyJWT, userController.logoutUser);
router.get("/check-session", authMiddleware.verifyJWT, authMiddleware.checkInactivity, userController.checkSession);

module.exports = router;