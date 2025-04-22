import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import ridesRouter from "./src/routes/rides";

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());


app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is healthy 🚴" });
});

app.use("/api/rides", ridesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
