import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from "./config/db.js";
import fixtureRoutes from "./routes/fixtureRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import leaderboardRoutes from "./routes/leaderBoardRoutes.js";
import { scoreEndedMatches } from "./utils/scoreEndedMatches.js";
import resultsRoutes from './routes/resultsRoutes.js';
import schedulePredictionScoring from './cronJobs/scorePredictions.js';
import teamRoutes from "./routes/teams.js";
import auth from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import testRoutes from "./routes/testRoutes.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://diskipred.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', auth);
app.use('/api/protected', protectedRoutes);

app.use('/api/fixtures', fixtureRoutes);
app.use('/api/users', userRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/test', testRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start cron jobs like scoreEndedMatches() right away
scoreEndedMatches();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); // connect DB first
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Schedule prediction scoring cron job
      schedulePredictionScoring();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

