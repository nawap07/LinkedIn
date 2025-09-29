import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"


export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        const ExistUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (ExistUser) {
            return res.status(400).json({ message: ' UserName or Email already exists' })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be atleast 8 characters' })

        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashPassword
        })

        let token = await genToken(res,user._id);

        
        res.status(201).json({ message: 'Signup', user })


    } catch (error) {
        return res.status(500).json({ message: "Signup Error", error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email and password is incorrect' })
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(400).json({ message: 'Email and password is incorrect' })
        }

        const token = genToken(res,user._id);

        res.status(200).json({ message: "Login successfully", user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login eror", error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ messsage: "Logout successfully" })
    } catch (error) {
        return res.status(500).json({ messsage: "Logout error", error: error.message })
    }
}