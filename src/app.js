const path = require("path");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const petRoutes = require("./routes/pet.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;