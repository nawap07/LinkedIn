import express from "express"
import getUserMidleware from "../middlewares/userAuth.middleware.js";
import { clearAllNotification, deleteNotification, getNotification } from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/get", getUserMidleware, getNotification)
router.delete("/deleteone/:id", getUserMidleware,  deleteNotification)
router.delete("/", getUserMidleware, clearAllNotification)

export default router;