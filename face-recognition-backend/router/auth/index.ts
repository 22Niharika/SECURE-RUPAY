import { Router } from 'express';
import faceLogin from './face-login';
import register from './register';
import login from './login';
import transaction from './transaction'
import data from './data';
import faceRegister from "./face-register"

const router = Router();

router.use("/face-login", faceLogin);
router.use("/register", register);
router.use("/login", login);
router.use("/transaction", transaction);
router.use("/data", data);
router.use("/face-register", faceRegister);

export default router;