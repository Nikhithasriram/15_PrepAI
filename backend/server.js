import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import conncetdb from "./config.js";
import userRouter from "./Routes/userroutes.js"
conncetdb();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
console.log("hello");
app.use("/api/users",userRouter);
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})