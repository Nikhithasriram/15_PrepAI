import express from "express"
import {loginuser , registeruser , currentuser} from "../controllers/usercontroller.js"
import validate from "../middleware/validate.js";
const router = express.Router();



router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/current").get(validate,currentuser);
export default router