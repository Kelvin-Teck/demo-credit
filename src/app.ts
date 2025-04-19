import express, { Request, Response } from "express";
import cors from "cors";

// Route Imports
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req:Request, res:Response) => {
    res.send('Server up and running!!!')
})

app.use("/api/user", userRoutes);

export default app;
