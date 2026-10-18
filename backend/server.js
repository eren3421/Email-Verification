import dns from "dns";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/connectDb.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

await connectDb();
const port  =3000;
app.listen(port, () => {
  console.log(`Sistem ${port} portunda çalışıyor`);
});
