import express from "express";
const app = express();
import cors from "cors";

// Allow requests from a specific URL
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
export default app;
