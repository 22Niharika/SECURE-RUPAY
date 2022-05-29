import { Router } from "express";
import User from "../../db/models/User";
import { faceRecognition } from "../../utils/faceRecognition";

const router = Router();

router.post("/", async (req, res) => {
    const image = req.body?.image
    if(!image){
      return res.status(400).send("No image provided")
    }
    const username = req.body?.username
    if(!username){
      return res.status(400).send("No username provided")
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(200).send("User not registered")
    }

    const results: any = await faceRecognition(image, username)

    if(
      !results ||
      results.length === 0 ||
      results[0].label==="unknown"
    ){
        return res.status(400).send("Authentication failed")
    }
      
    const confidence = (10 - results[0].distance*2) * 10
    if(confidence<90){
      return res.status(400).send("Authentication failed")
    }
    return res.status(200).json({
      status: "success",
      confidence
    })
})

export default router