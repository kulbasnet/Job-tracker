import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {sequelize} from "./models/db.js";
import route from "./routes/route.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

//Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", route);




const startServer = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // Synchronize models with the database
  app.get("/", (req, res) => {
    res.send("Hello TypeScript + Express!");
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  console.log("Connection has been established successfully.");
};

startServer();

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync(); // Synchronize models with the database
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect:", error);
//   }
// }

// testConnection();
