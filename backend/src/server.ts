import express from "express";
import dotenv from "dotenv";

import healthRouter from "./routes/health.js";
import authRouter   from "./routes/auth.js";
import ridesRouter  from "./routes/rides.js";

dotenv.config();

const app = express();
console.log("Mounting /api/auth");

app.use(express.json());


app.use(healthRouter);


app.use("/api/auth", authRouter);
app.use("/api/rides", ridesRouter);


app.get('/test-endpoint', (_req, res) => {
  res.status(200).json({ message: 'Test endpoint working' });
});
app.get("/test-debug", (_req, res) => {
  res.status(200).json({ message: "Debug endpoint working" });
});

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

export default app;
