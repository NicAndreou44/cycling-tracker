import express from "express";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import ridesRouter from "./routes/rides.js";
import { authenticateJWT } from "./middleware/authmiddleware.js";
import { mockAuthMiddleware } from "./middleware/testAuth.js";

dotenv.config();
const app = express();
console.log("Mounting /api/auth");
app.use(express.json());
app.use(healthRouter);
app.use("/api/auth", authRouter);


const authMiddleware = process.env.NODE_ENV === 'test' 
  ? mockAuthMiddleware 
  : authenticateJWT;


app.use("/api/rides", authMiddleware, ridesRouter);

app.get('/test-endpoint', (_req, res) => {
  res.status(200).json({ message: 'Test endpoint working' });
});

app.get("/test-debug", (_req, res) => {
  res.status(200).json({ message: "Debug endpoint working" });
});

app.use((req, res) => {
  res.status(404).json({ errors: ["Not found"] });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
 
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ errors: ["Internal server error"] });
});

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

export default app;