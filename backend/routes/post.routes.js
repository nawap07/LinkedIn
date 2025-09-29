import express from "express";
import getUserMidleware from "../middlewares/userAuth.middleware.js"
import { comments, createPost, getPost, like } from "../controllers/post.controllers.js";
import upload from "../middlewares/multer.middleware.js"

const router = express.Router();

router.post("/create", getUserMidleware, upload.single("image"), createPost)
router.get("/getpost", getUserMidleware, getPost)
router.get("/like/:id", getUserMidleware,  like)
router.post("/comment/:id", getUserMidleware,  comments)

export default router;