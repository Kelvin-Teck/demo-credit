import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { testConnection } from "./database";
// import { gracefulShutdown } from "database/connection";

const PORT = process.env.PORT || 2000;


const startApp = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startApp();


// Handle termination signals
// process.on('SIGTERM', () => gracefulShutdown());
// process.on('SIGINT', () => gracefulShutdown());

// Optional: Enhanced shutdown with HTTP server closure
// export const enhancedShutdown = (): void => {
//   console.log('Shutting down server...');
//   server.close(() => {
//     console.log('Server closed.');
//     console.log('Closing database connections...');
//     knex.destroy(() => {
//       console.log('Database connections closed');
//       process.exit(0);
//     });
//   });
// };