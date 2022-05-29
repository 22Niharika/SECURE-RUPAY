import { Router } from "express";
import User from "../../db/models/User";

const router = Router();

router.post("/", async (req, res) => {
    const { username, transactionAmount, remark } = req.body;
    if(!username || !transactionAmount) {
        return res.status(400).json({ error: "Please provide username" });
    }
    const user = await User.findOne({ username });
    if(!user){
        return res.status(200).json({
            status: "error",
            error: "User not found",
        });
    }
    const newAmount = user.currentAmount + parseInt(transactionAmount, 10);

    const newHistory = [...user.history, {
        transactionAmount,
        remark: remark || "No remark",
    }];
    await User.findOneAndUpdate({ username }, {
        currentAmount: newAmount,
        history: newHistory
    });
    res.status(200).json({
        status: "success",
        message: "User found",
        data: {
            currentAmount: newAmount,
            history: newHistory
        }
    });

})

export default router