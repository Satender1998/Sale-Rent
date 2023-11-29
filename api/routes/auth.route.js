import express from "express";
import { signup, signin, google, signOut } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/signup", signup) // Route to handle user signup
router.post("/signin", signin) // Route to handle user signin
router.post('/google', google) // Route to handle Google OAuth authentication
router.get('/signout', signOut) // Route to handle user signout

export default router;