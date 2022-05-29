import { Router } from 'express';
import authRouter from "./auth"
import ping from "./ping"

const router = Router()

router.use("/ping", ping)
router.use("/auth", authRouter)


export default router