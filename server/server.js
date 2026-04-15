import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import searchRoute from "./routes/search.route.js";
import { API_BASE_PATH, DEFAULT_PORT } from "./config/constants.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(API_BASE_PATH, searchRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
