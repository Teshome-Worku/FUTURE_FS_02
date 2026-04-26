import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

//database
connectDB();

// middleware
app.use(cors());
app.use(express.json());

//lead routes
app.use("/api/leads", leadRoutes);

//note routes
app.use("/api/notes", noteRoutes);

//auth routes
app.use("/api/auth", authRoutes);
// test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});