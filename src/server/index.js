import express from "express";
import dotenv from "dotenv";
import {sequelize} from "./models/db.js";
import application from "./models/application.js";
import route from "./routes/route.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", route);

app.get("/", (req, res) => {
  res.send("Hello TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


async function testConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Synchronize models with the database
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect:", error);
  }
}

testConnection();
