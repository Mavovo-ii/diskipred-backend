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
  origin: ['http://localhost:5173','https://diskipred.netlify.app'],
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



// Start cron jobs
scoreEndedMatches();

app.listen(3000, () => {
  connectDB()
})
