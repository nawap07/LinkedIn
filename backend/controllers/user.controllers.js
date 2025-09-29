import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser = async (req, res) => {
   try {
      if (!req.user) {
         return res.status(400).json({ message: "Login First" })
      }
      res.status(200).json({ message: "Get Profile", user: req.user })
   } catch (error) {
      return res.status(500).json({ message: "Error on getProfile" })

   }
}

export const getUser = async (req, res) => {
   try {
      const user = await User.find().select("-password");
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json({ message: "All users", user });
   } catch (error) {
      return res.status(500).json({ message: "Error on Get User" })

   }
}

export const updateProfile = async (req, res) => {
   try {
      const { firstName, lastName, userName, headline, location, gender } = req.body;

      let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
      let education = req.body.education ? JSON.parse(req.body.education) : [];
      let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
      let profileImage;
      let coverImage;
      console.log(req.files);

      if (req.files.profileImage) {
         profileImage = await uploadOnCloudinary(req.files.profileImage[0].path)
      }
      if (req.files.coverImage) {
         coverImage = await uploadOnCloudinary(req.files.coverImage[0].path)
      }

      const user = await User.findByIdAndUpdate(req.user, {
         firstName, lastName, userName, headline, location, gender, skills, education, experience, profileImage, coverImage
      }, { new: true }).select("-password")

      if (!user) {
         return res.status(401).json({ message: "Error on update" })
      }
      res.status(200).json(user);

   } catch (error) {
      return res.status(500).json({ message: "Error on updateProfile", err: error.message })
   }
}

export const getProfile = async (req, res) => {
   try {
      const { userName } = req.params;

      const user = await User.findOne({ userName }).select("-password");
      if (!user) {
         return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json(user)
   } catch (error) {
      return res.status(500).json({ message: "Error on get Profile", error: error.message })
   }
}

export const search = async (req, res) => {
   try {
      const { query } = req.query;
      if (!query || query.trim()==="") {
         return res.status(200).json([]);
      }

      const users = await User.find({
         $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { userName: { $regex: query, $options: "i" } },
            { skills: { $in: [query] } },
         ]
      })
      res.status(200).json(users)
   } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Error on search", error: error.message })
   }
}

export const getSuggestedUsers = async (req, res) => {
   try {
      const currentUser = await User.findById(req.user._id).select("connections");

      const suggestUsers = await User.find({
         _id: {
            $ne: currentUser, $nin: currentUser.connections
         }
      }).select("-password")
      res.status(200).json(suggestUsers)
   } catch (error) {
      return res.status(500).json({ message: "GetSuggested users error", error: error.message })
   }
}