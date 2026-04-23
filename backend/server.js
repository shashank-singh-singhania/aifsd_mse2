const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://aifsd-mse2.onrender.com",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
].filter(Boolean);

const renderOriginRegex = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients like Render health checks and Postman.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (renderOriginRegex.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "backend", env: process.env.NODE_ENV || "development" });
});

app.use("/api", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));

app.listen(port, () =>
  console.log(`Server running on ${port}`)
);