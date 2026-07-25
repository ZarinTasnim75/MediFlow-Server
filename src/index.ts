import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import doctorRoutes from "./routes/doctorRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

    app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send("INDEX.TS IS RUNNING");
});

app.use("/api/v1/appointments", appointmentRoutes);

app.use("/api/v1/doctors", doctorRoutes);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server running on ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();