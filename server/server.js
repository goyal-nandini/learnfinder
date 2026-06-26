import "dotenv/config";
import express from "express";
import cors from "cors";
import searchRouter from "./routes/search.js";
import mongoose, { startSession } from "mongoose";
import authRouter from "./routes/auth.js";
import suggestRouter from "./routes/suggest.js";
import summarizeRouter from "./routes/summarize.js";
import pathRouter from "./routes/path.js";
import SavedRouter from "./routes/saved.js";
import SavedPathRouter from "./routes/savedPath.js";

const app = express();
// app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://learnfinder.vercel.app' 
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRouter);

// free routes - no middleware
app.use('/api/search', searchRouter);
app.use('/api/suggest', suggestRouter);
app.use('/api/summarize', summarizeRouter);
app.use('/api/path', pathRouter);

// protected routes - required token
app.use('/api/saved', SavedRouter);
app.use('/api/savedpath', SavedPathRouter);  

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected");

        app.listen(process.env.PORT || 5000, () => console.log("server Running"));
    } catch (err) {
        console.error('startup failed:', err);
        process.exit(1); // // kill the process if DB fails — no point running without DB
    }
}

startServer();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
