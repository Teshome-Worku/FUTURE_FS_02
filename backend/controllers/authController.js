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
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
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