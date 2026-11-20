require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
