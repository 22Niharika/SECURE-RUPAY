import { Router } from "express";
import User from "../../db/models/User";

const router = Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const user = await User.findOne({ username });
        if (!user) {
          res.status(200).json({
            status: "error",
            error: "User not found",
          });
          return;
        }
        const { password: DBPassword } = user;
       if (password === DBPassword) {
            res.status(200).json({
              status: "success",
              message: "Correct password",
            });
       }else{
        res.status(200).json({
            status: "error",
            error: "Wrong password",
          });
       }
    } else {
        res.status(400).json({ error: "Please provide all required fields" });
    }
})

export default router