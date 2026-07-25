import express from "express";

import {
  bookAppointment,
  getMyAppointments,
  deleteAppointment,
} from "../controllers/appointmentController";

import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.post("/", verifyJWT, bookAppointment);

router.get("/my", verifyJWT, getMyAppointments);

router.delete("/:id", verifyJWT, deleteAppointment);

export default router;