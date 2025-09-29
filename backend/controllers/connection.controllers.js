import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../index.js"
import Notification from "../models/notification.model.js";

export const sendConnection = async (req, res) => {
    try {
        const { id } = req.params;
        const sender = req.user._id;

        const user = await User.findById(sender);

        if (sender === id) {
            return res.status(400).json({ message: "You can not send request yourself" })
        }

        if (user.connections.includes(id)) {
            return res.status(400).json({ message: "you are already connected" })
        }

        const existingConnection = await Connection.findOne({
            sender,
            receiver: id,
            status: "pending"
        })
        if (existingConnection) {
            return res.status(400).json({ message: "request already exists" })
        }

        const newConnection = await Connection.create({
            sender,
            receiver: id
        })

        const reciverSocketId = userSocketMap.get(id)
        let senderSocketId = userSocketMap.get(sender)

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("statusUpdate", { updateUserId: sender, newStatus: "received" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updateUserId: id, newStatus: "pending" })
        }


        res.status(200).json(newConnection)
    } catch (error) {
        return res.status(500).json({ message: `sendconnection error ${error.message}` })
    }
}

export const acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const userId = req.user._id

        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(400).json({ message: "connection does not exists" })
        }

        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }

        connection.status = "accepted";
        const notification = await Notification.create({
            reciver: connection.sender,
            type: "connectionAccepted",
            relatedUser: userId,
        })

        await connection.save();

        await User.findByIdAndUpdate(req.user, {
            $addToSet: { connections: connection.sender._id }
        })
        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: { connections: req.user._id }
        })

        const reciverSocketId = userSocketMap.get(connection.receiver._id.toString())
        let senderSocketId = userSocketMap.get(connection.sender._id.toString())

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("statusUpdate", { updateUserId: connection.sender._id, newStatus: "disconnect" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updateUserId: req.user, newStatus: "disconnect" })
        }

        res.status(200).json({ message: "Connection Accepted" })
    } catch (error) {
        return res.status(500).json({ message: "Error on accecpted connection" })
    }
}
export const rejectedConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;

        let connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(400).json({ message: "connection does not exists" })
        }

        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }

        connection.status = "rejected";
        await connection.save();


        res.status(200).json({ message: "Connection rejected" })
    } catch (error) {
        return res.status(500).json({ message: "Error on  rejected connection" })
    }
}

export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        let currentUser = await User.findById(currentUserId);
        if (currentUser.connections.includes(targetUserId)) {
            return res.json({ status: "disconnect" });
        }

        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId },
            ],
            status: 'pending'
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ status: "pending" });
            } else {
                return res.json({ status: "received", requestId: pendingRequest._id })
            }
        }

        res.json({ status: "connect" })
    } catch (error) {
        return res.status(500).json({ message: "Get connection status error" })

    }
}

export const removeConnection = async (req, res) => {
    try {
        const myId = req.user._id;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myId, {
            $pull: { connections: otherUserId }
        })
        await User.findByIdAndUpdate(otherUserId, {
            $pull: { connections: myId }
        })

        const reciverSocketId = userSocketMap.get(otherUserId)
        let senderSocketId = userSocketMap.get(myId)

        if (reciverSocketId) {
            io.to(reciverSocketId).emit("statusUpdate", { updateUserId: myId, newStatus: "connect" })
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", { updateUserId: otherUserId, newStatus: "connect" })
        }

        res.status(200).json({ message: "Connection remove successfully" })
    } catch (error) {
        res.status(500).json({ message: "removeConnection error" })
    }
}

export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await Connection.find({ receiver: userId, status: "pending" })
            .populate("sender", "firstName lastName email userName profileImage headline")

        return res.status(200).json(requests)
    } catch (error) {
        console.log("Error in getConnectionRequests controllers", error.message);
        return res.status(500).json({ message: "Server error" })
    }
}

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .populate("connections", "firstName lastName userName profileImage headline connections")
        res.status(200).json(user.connections)
    } catch (error) {
        console.log("Error in getUserConnections controllers", error.message);
        return res.status(500).json({ message: "Server error" })
    }
}