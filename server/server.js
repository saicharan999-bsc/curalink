import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import searchRoute from "./routes/search.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ FINAL ROUTE (NO CONFUSION)
app.use("/api", searchRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});