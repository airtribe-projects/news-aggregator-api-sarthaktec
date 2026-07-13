require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRound = 5;

const User = require('../models/userModel');

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All Fields Are Mandatory",
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                error: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, saltRound);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });

        await newUser.save();

        res.status(200).json({
            message: "User Created Succefully",
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: userData,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }

        const isMatched = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatched) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,
            },
            process.env.JWT_KEY
        );

        return res.status(200).json({
            message: "Login Successfully",
            token,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = { createUser, getUserById, userLogin };