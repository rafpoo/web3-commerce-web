import express from "express";
import { Application } from "express";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
import faucetRoutes from "./routes/faucet";
import nftRoutes from "./routes/nft";

// Use routes
app.use("/api/faucet", faucetRoutes);
app.use("/api/nft", nftRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server on port 3001 to avoid conflict with frontend
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
