import { Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db";
import { AuthRequest } from "../middleware/verifyJWT";

export const bookAppointment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const appointments = db.collection("appointments");

    const appointment = {
      ...req.body,
      patientEmail: req.user?.email,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await appointments.insertOne(appointment);

    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyAppointments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const appointments = db.collection("appointments");

    const result = await appointments
      .find({
        patientEmail: req.user?.email,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      appointments: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteAppointment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const appointments = db.collection("appointments");

    const result = await appointments.deleteOne({
      _id: new ObjectId(req.params.id as string),
      patientEmail: req.user?.email,
    });

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Appointment Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};