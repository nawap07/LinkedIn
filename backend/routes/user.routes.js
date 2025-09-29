import express from "express";
import { getCurrentUser, getProfile, getSuggestedUsers, getUser, search, updateProfile } from "../controllers/user.controllers.js";
import getUserMidleware from "../middlewares/userAuth.middleware.js";
import upload from "../middlewares/multer.middleware.js"

const router = express.Router();

router.get("/currentuser", getUserMidleware, getCurrentUser);
router.get("/alluser", getUserMidleware, getUser);
router.get("/profile/:userName", getUserMidleware, getProfile);
router.put("/updateprofile", getUserMidleware, upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
]), updateProfile);
router.get("/search", getUserMidleware, search);
router.get("/suggested", getUserMidleware, getSuggestedUsers);



export default router;