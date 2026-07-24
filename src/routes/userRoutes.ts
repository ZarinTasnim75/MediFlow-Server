import express from "express";
import { registerUser, loginUser ,updateProfile} from "../controllers/userController";
import { AuthRequest, verifyJWT } from "../middleware/verifyJWT";
import { db } from "../config/db";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", verifyJWT, async (req: AuthRequest, res) => {
  try {
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { email: req.user?.email },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.patch(
  "/profile",
  verifyJWT,
  updateProfile
);

export default router;