import dns from "dns"
import cookieParser from "cookie-parser";
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from "express"
import dotenv from "dotenv"
dotenv.config();
import {connectDb} from "./db/connectDb.js"
import authRoutes from "./routes/auth.js"
const app=express()
/*app.get("/",(req,res)=>{
    res.send("123");
});*/
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.listen(3000,()=>{
    connectDb();
console.log("Sistem çalışıyor");
});