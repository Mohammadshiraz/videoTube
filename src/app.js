import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//cors use to accept frontend request
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//cookie parser accept the cookie from user
app.use(cookieParser());

//json accept the json format from the user
app.use(express.json({ limit: "16kb" }));

//urlencoded accept all type of url character
app.use(express.urlencoded({ limit: "16kb", extended: true }));

//static create a folder and store data in server
app.use(express.static("public"));

import userRouter from "./routes/user.route.js";
app.use("/api/v1/user", userRouter);

export { app };
