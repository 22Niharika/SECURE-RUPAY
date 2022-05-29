import { Router } from "express";
import User from "../../db/models/User";

const router = Router();

router.post("/", async (req, res) => {
    const { username } = req.body;
    if (username) {
        const user = await User.findOne({ username });
        if (!user) {
            res.status(200).json({
                status: "error",
                error: "User not found",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: "User found",
            data: {
                currentAmount: user.currentAmount,
                totalAmount: user.totalAmount,
                history: user.history
            }
        });
    } else {
        res.status(400).json({ error: "Please provide username" });
    }
})

export default router