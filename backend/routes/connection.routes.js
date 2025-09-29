import express from "express"
import getUserMidleware from "../middlewares/userAuth.middleware.js";
import { acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectedConnection, removeConnection, sendConnection } from "../controllers/connection.controllers.js";

const router = express.Router();

router.post("/send/:id", getUserMidleware, sendConnection);
router.put("/accept/:connectionId", getUserMidleware, acceptConnection);
router.put("/reject/:connectionId", getUserMidleware, rejectedConnection);
router.get("/status/:userId", getUserMidleware, getConnectionStatus);
router.delete("/remove/:userId", getUserMidleware, removeConnection);
router.get("/requests", getUserMidleware, getConnectionRequests);
router.get("/", getUserMidleware, getUserConnections);

export default router;