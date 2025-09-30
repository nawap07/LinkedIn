import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
    try {
        const { description } = req.body;
        let newPost;
        if (req.file) {
            let image = await uploadOnCloudinary(req.file.path)
            newPost = await Post.create({
                author: req.user,
                description,
                image
            })
        } else {
            newPost = await Post.create({
                author: req.user,
                description,
            })
        }
        res.status(201).json(newPost)
    } catch (error) {
        return res.status(500).json({ message: "New post error", err: error.message })
    }
}

export const getPost = async (req, res) => {
    try {
        const allPosts = await Post.find()
            .populate("author", "firstName lastName  profileImage headline userName")
            .populate("comment.user", "firstName lastName  profileImage headline")
            .sort({ createdAt: -1 })
        if (allPosts.length === 0) {
            return res.status(400).json({ message: "No Posts" })
        }
        res.status(200).json({ message: "All Posts", post: allPosts })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Get Post error", error: error.message })
    }
}

export const like = async (req, res) => {

    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.like.includes(userId.toString());

        if (isLiked) {
            // remove like (dislike)
            post.like = post.like.filter((id) => id.toString() !== userId.toString());
            await post.save();
            io.emit("likeUpdate", { postId, likes: post.like })
            return res.status(200).json({ message: "Disliked", post });
        } else {
            // add like
            post.like.push(userId);
            if (post.author != userId) {
                const notification = await Notification.create({
                    reciver: post.author,
                    type: "like",
                    relatedUser: userId,
                    reletedPost: postId
                })
            }

            await post.save();
            io.emit("likeUpdate", { postId, likes: post.like })
            return res.status(200).json({ message: "Liked", post });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Likes Error", error: error.message });
    }
}

export const comments = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comment: { content, user: userId } }
        }, { new: true })
            .populate("comment.user", "firstName lastName profileImage headline")
            .sort({ createdAt: -1 })
        if (post.author != userId) {
            const notification = await Notification.create({
                reciver: post.author,
                type: "comment",
                relatedUser: userId,
                reletedPost: postId
            })
        }

        io.emit("commentAdded", { postId, comments: post.comment })

        res.status(200).json({ message: "Comment", post })
    } catch (error) {
        return res.status(500).json({ message: `Comment error ${error.message}` })
    }
}