import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  league: { type: String, required: true },
  logo: { type: String, required: true },
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
