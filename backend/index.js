import expres from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import notificationRouter from "./routes/notification.routes.js"
import http from "http"
import { Server } from "socket.io";
const app = expres();

const server = http.createServer(app);

export const io = new Server(server, {
    cors: ({
        origin: "https://linkedin-frontend-rrig.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
    })
})

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors({
    origin: "https://linkedin-frontend-rrig.onrender.com",
    credentials: true
}))
app.use(expres.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);

await connectDB();
app.get("/", (req, res) => {
    res.send("Jai hind")
})

export const userSocketMap = new Map()

io.on("connection", (socket) => {
    // console.log("User connected", socket.id);

    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id)
        console.log(userSocketMap);

    })

    socket.on("disconnect", (socket) => {
        // console.log("User disconnect successfully", socket.id);
    })

})
server.listen(port, () => {
    console.log(`Server started at port : http://localhost:${port}`);

})