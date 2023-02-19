import express from "express";
import cors from "cors";
require("dotenv").config();

const PORT = process.env.PORT || 3000;

//init express
const app = express();

app.use(cors);
app.listen(PORT, () => console.log("http://localhost:3000"));