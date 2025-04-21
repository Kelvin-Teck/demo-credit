import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { testConnection } from "./database";

const PORT = process.env.PORT || 2000;

const startApp = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startApp();
