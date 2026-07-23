import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from "bcrypt";
import validator from "validator";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
    } = req.body;

    // Empty field check
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const usersCollection = db.collection("users");

    // Existing user check
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      dateOfBirth,
      role: "patient",
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "Registration Successful",
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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `This account is registered as ${user.role}.`,
      });
    }

    const token = generateToken({
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};