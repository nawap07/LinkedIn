import express from "express";
import { login, logout, signUp } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout",  logout);


export default router;