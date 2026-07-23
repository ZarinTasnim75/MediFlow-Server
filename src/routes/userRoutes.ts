import express from "express";
import { registerUser } from "../controllers/userController";
import { loginUser } from "../controllers/userController";
import { AuthRequest, verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", verifyJWT, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});



export default router;