import "dotenv/config"; // Load env vars before other imports
import express from "express";
import bookingRoutes from "./routes/booking.js";
import { initFirebase } from "./firebase.js";

// dotenv.config(); // Removed redundant call
initFirebase(); // Initialize Firebase Admin once

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.send("soulbackend v2");
});

// Register routes
app.use("/api", bookingRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
