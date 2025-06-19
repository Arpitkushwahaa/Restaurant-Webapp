import express from "express";
import { signup, login, logout, checkAuth, updateProfile, setAdmin, getUsers } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", isAuthenticated, checkAuth);
router.put("/profile/update", isAuthenticated, updateProfile);

// Admin routes
router.post("/set-admin", isAuthenticated, setAdmin);
router.get("/users", isAuthenticated, getUsers);

export default router;
