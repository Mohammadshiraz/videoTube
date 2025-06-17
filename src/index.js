import dotenv from "dotenv";
dotenv.config();
import connectDB from "../src/db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server started at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed", err);
  });
