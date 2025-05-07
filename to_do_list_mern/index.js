import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './utils/mongodb.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './utils/swagger.js';

import todoRoute from "./Routes/todoRoute.js";
import usersRoute from "./Routes/usersRoute.js";

const app = express();
dotenv.config()

app.use(express.json()); // Built-in body-parser for parsing JSON
app.use(cors({credentials: true})); // Enable Cross-Origin Resource Sharing
app.use(cookieParser()); // Enable cookie parsing

const PORT = process.env.PORT
connectDB();

app.get('/', (req, res) => res.send("API Working"));

app.use("/service/todo", todoRoute)
app.use("/service/user", usersRoute)

// api documentation endpoint
app.use("/todolist/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Todo List Management API",
}))

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));