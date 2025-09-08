import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import projectRoutes from "./routes/Project.routes.js";
import teamRoutes from "./routes/Team.routes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/projects", projectRoutes);
app.use("/api/join-forms",teamRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT,() => {
    connectDB();
    console.log("Server started at PORT ",PORT)
})