import express from "express";
import {
  getDoctors,
  getDoctorById,
  updateDoctor,
} from "../controllers/doctorController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

// public
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// admin only
router.patch("/:id", verifyJWT, updateDoctor);

export default router;