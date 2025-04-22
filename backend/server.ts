import express from "express";
import dotenv from "dotenv";
import ridesRouter from "./src/routes/rides";

dotenv.config();
const app = express();

app.use(express.json());
app.get("/health", (_req, res) => {
  res.send("Healthy");
});

app.use("/api/rides", ridesRouter);

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`Listening on ${port}`));
}

export default app;
