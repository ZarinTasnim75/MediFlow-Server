import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db";
import { AuthRequest } from "../middleware/verifyJWT";

// Get all doctors
export const getDoctors = async (
  req: Request,
  res: Response
) => {
  try {
    const doctors = await db
      .collection("doctors")
      .find()
      .toArray();

    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get one doctor
export const getDoctorById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;
    const doctor = await db.collection("doctors").findOne({
      _id: new ObjectId(id),
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update doctor (admin only)
export const updateDoctor = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const { image, fee } = req.body;

    const result = await db.collection("doctors").updateOne(
      {
        _id: new ObjectId(req.params.id as string),
      },
      {
        $set: {
          image,
          fee,
        },
      }
    );

    res.json({
      success: true,
      message: "Doctor Updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};