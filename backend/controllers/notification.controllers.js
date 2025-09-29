import Notification from "../models/notification.model.js"

export const getNotification = async (req, res) => {
    try {
        const notification = await Notification.find({ reciver: req.user._id })
            .populate("relatedUser", "firstName lastName userName profileImage")
            .populate("reletedPost", "image description")
        res.status(200).json(notification)
    } catch (error) {
        res.status(500).json({ message: 'Get Notification error', error: error.message })
    }
}
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findOneAndDelete({
            _id: id,
            reciver: req.user
        })

        res.status(200).json({ message: " Notification Deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: 'Delete Notification error', error: error.message })
    }
}
export const clearAllNotification = async (req, res) => {
    try {
        await Notification.deleteMany({
            reciver: req.user._id
        })

        res.status(200).json({ message: "All Notification Clear successfully" })
    } catch (error) {
        res.status(500).json({ message: 'Clear All Notification error', error: error.message })
    }
}