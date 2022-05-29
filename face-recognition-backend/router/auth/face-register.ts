import { Router } from "express";
import fs from "fs"
import path from "path";
import Jimp from "jimp"
import { uid } from "uid"

const router = Router();

router.post("/", async (req, res) => {
    const { username, image } = req.body;
    if(!username || !image) {
        return res.status(400).json({
            status: "error",
            error: "Please provide all required fields"
        })
    }
    try{
        const user_path = path.join(__dirname, `../../users/${username}`)

        if (!fs.existsSync(user_path)) {
            fs.mkdirSync(user_path)
        }
        const imgBuffer = image.split(",")[1];
        const buffer = Buffer.from(imgBuffer, "base64");
        Jimp.read(buffer, (err, res) => {
          if (err) throw new Error(err.toString());
          res.quality(10).write(`${user_path}/${username}-${uid(5)}.jpg`);
        });
        res.status(201).json({
            status: "success",
            message: "Image saved successfully"
        })
    }catch(e:any){
        res.status(400).json({
            status: "error",
            error: e.toString()
        })
    }
})

export default router