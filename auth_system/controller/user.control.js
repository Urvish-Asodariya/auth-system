const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../model/user.model");

exports.register = async (req, res) => {
    try {
        const { userID, username, email, password, firstName, lastName, role, accountStatus } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = new user({ userID, username, email, password: hashedPassword, firstName, lastName, role, accountStatus });
        await users.save();
        const success = {
            message: "User created successfully",
            status: 201
        };
        return res.json(success);
    }
    catch (err) {
        const error = {
            message: err.message,
            status: err.status
        };
        return res.json(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await user.findOne({ email });
        if (!users) {
            const error = {
                message: "User not found",
                status: 404
            };
            return res.json(error);
        } else {
            const isMatch = await bcrypt.compare(password, users.password);
            if (!isMatch) {
                const error = {
                    message: "Invalid password",
                    status: 401
                };
                return res.json(error);
            } else {
                const token = jwt.sign({ userID: users.userID, role: users.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
                const success = {
                    message: "User logged in successfully",
                    status: 200
                };
                const option=   {
                    httpOnly: true,
                    maxAge: 3600000,
                    secure: true,
                    sameSite: "strict"
                }
                res.json(success);
                res.cookie("TOKEN", token , option );
            }
        }
    }
    catch (err) {
        const error = {
            message: err.message,
            status: err.status
        };
        return res.json(error);
    }
};

exports.changepassword = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1] || req.header('Authorization')?.split(' ')[1];
        const { newpass } = req.body;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await user.findOne({ userID: decoded.userID });
        if (!user) {
            const error = {
                message: "User not found",
                status: 404
            };
            return res.json(error);
        } else {
            const hashedPassword = await bcrypt.hash(newpass, 10);
            user.password = hashedPassword;
            await user.save();
            const success = {
                message: "Password changed successfully",
                status: 200
            };
            return res.json(success);
        }
    }
    catch (err) {
        const error = {
            message: err.message,
            status: err.status
        };
        return res.json(error);
    }
};