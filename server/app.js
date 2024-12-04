dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';  
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import CustomError from "./utils/customError.js";
import { errorHanlder } from "./utils/errorHandler.js";
import { v2 as cloudinary } from 'cloudinary';


// Handling Uncaught Exception;
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("server is shutting down due to uncaughtException occur!");
  process.exit(1);
});

const app = express();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
  credentials: true, 
}));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use("uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.json())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));

// User Routes
app.use("/api/v1/user/", userRoutes);

// Ticket Routes
app.use("/api/v1/ticket/", ticketRoutes);

// Catch-all route for handling 404 errors
app.all("*", (req, res, next) => {
  const error = new CustomError(
    `can't find ${req.originalUrl} on the server`,
    404
  );
  next(error);
});

// Catch-all for React frontend
app.get("*", (req, res)=>{
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
})

// Global Error Handler
app.use(errorHanlder);

export default app;
