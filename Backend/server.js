import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from "./routes/route.js";
import authRoutes from "./routes/authRoutes.js";


const app=express();


app.use(express.json());
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


const connectDB=async()=>{
    if(mongoose.connection.readyState>=1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected With Database!");
    } catch (error) {
        console.log("Failed to connect with Db",error);
        throw error;
    }
};

app.use(async(req,res,next)=>{
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({error:"Database connection failed"});
    }
});

app.use("/api/auth",authRoutes);
app.use("/api",chatRoutes);

export default app;




