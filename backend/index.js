require("dotenv").config({ path: __dirname + "/.env" });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);



console.log("Starting server...");

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const ridesRouter = require("./src/routes/rides");

app.get("/health", (req, res) => {
  res.send("Server is healthy 🚴‍♂️");
});

app.use("/api/rides", ridesRouter);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
