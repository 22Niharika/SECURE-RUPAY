import { Router } from "express";
import User from "../../db/models/User";

const router = Router();

router.post("/", async (req, res) => {
    const { username, password,  } = req.body;
    if (username && password) {
        const user = await User.findOne({ username });
        if (user) {
            res.status(400).json({
                status: "error",
                error: "User already exists",
            });
        } else {
            const newUser = new User({
                username,
                password
            });
            await newUser.save();
            res.status(201).json({
                status: "success",
                message: "User created successfully"
            });

        }
    }else{
        res.status(400).json({
            status: "error",
            error: "Please provide all required fields"
        });
    }
})

export default router