import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: ["like", "comment", "connectionAccepted"]

    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reletedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
