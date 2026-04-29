import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate token
const generateToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Register admin
export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const userExists = await User.findOne({
            email
        });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc Login admin
export const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim()
        });

        if (user && (await bcrypt.compare(password.trim(), user.password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc Get current user
export const getMe = async (req, res) => {
    res.json(req.user);
};

// @desc Update profile
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { name } = req.body;
        if(!name.trim()){
            return res.status(400).json({ message: "Please provide name" });
        }
        if(name.trim() === user.name){
            return res.status(400).json({ message: "Please provide different name" });
        }

        user.name = name || user.name;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new passwords" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};