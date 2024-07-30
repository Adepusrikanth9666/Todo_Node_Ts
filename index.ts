import express, { Express } from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import cors from "cors";
import bodyParser from "body-parser";
import { Task } from "./src/tasks/tasks.entity";
import { taskRouter } from "./src/tasks/tasks.router";

// Instantiate express app
const app: Express = express();
dotenv.config();

// Parse the request body
app.use(bodyParser.json());

// Use cors install types as well
app.use(cors());

// Define Sever Port
const port = process.env.PORT;

// create Database connection
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  synchronize: true, //crete a tables in database
});

// Create a default route

// Initialize data source
AppDataSource.initialize()
  .then(() => {
    app.listen(port);
    console.log("Data Source has Started Successfully");
  })
  .catch((error) => {
    console.error("Error During th data Source initialization", error);
  });

app.use("/", taskRouter);
