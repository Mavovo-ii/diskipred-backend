import express from "express";
import dotenv from 'dotenv'
import cors from 'cors' 
import connectDB from "./config/db.js";
import fixtureRoutes from "./routes/fixtureRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import predictionRoutes from "./routes/predictionRoutes.js"
import prizeRoutes from "./routes/prizeRoutes.js"
import leaderboardRoutes from "./routes/leaderBoardRoutes.js"
import { scoreEndedMatches } from "./utils/scoreEndedMatches.js";
import teamRoutes from "./routes/teams.js"
import auth from "./routes/auth.js"
import protectedRoutes from "./routes/protected.js"


const app = express()

app.use(cors({
  origin: ['https://diskipred.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
dotenv.config()


app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/protected', protectedRoutes)

app.use('/api/fixtures', fixtureRoutes)
app.use('/api/users', userRoutes)
app.use('/api/predictions', predictionRoutes)
app.use('/api/prizes', prizeRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/teams', teamRoutes)

app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // optional for debugging: stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});




// Start cron jobs
scoreEndedMatches();

app.listen(3000, () => {
  connectDB()
})
