import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();
console.log("Auth router loaded");

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
