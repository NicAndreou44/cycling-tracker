require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();
const rideRoutes = require("./src/routes/rides");

app.use(express.json());
app.use("/rides", rideRoutes);


if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
