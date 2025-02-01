import bcrypt from "bcrypt"
import asyncHandler from "express-async-handler"
import { User } from "../models/usermodel.js";
import jwt from "jsonwebtoken"
const loginuser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All feilds are mandatory");
    }
    const userexist = await User.findOne({ email });
    if (!userexist) {
        res.status(400);
        throw new Error("User does not exist");
    }
    if (await bcrypt.compare(password, userexist.password)) {
        const accessToken = jwt.sign({
            user: {
                username: userexist.username,
                email: userexist.email,
                id: userexist.id,
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })
        res.status(200).json({ accessToken })
    } else {
        res.status(400);
        throw new Error("Incorrect credentials")
    }
})

const registeruser = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        res.status(400);
        throw new Error("All feilds are mandatory");
    }
    console.log(fullname, email, password);
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("Email already exists");
    }
    //Hash password

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
        fullname, email, password: hashedPassword
    });


    console.log("gveruigv");

    if (user) {
        res.status(200).json({ _id: user.id, email: user.email })
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }
})

//private
const currentuser = asyncHandler(async (req, res) => {
    const email = req.user.email;
    const user = await User.findOne({ email });

    res.status(200).json(user);
})



// module.exports = { loginuser, registeruser, currentuser }
export { loginuser, registeruser, currentuser }