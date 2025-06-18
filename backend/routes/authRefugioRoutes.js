import express from "express";
import { loginRefugio, registerRefugio } from "../controllers/authRefugioController.js";

const router = express.Router();

router.post("/login-refugio", loginRefugio);
router.post("/register-refugio", registerRefugio);

export default router;