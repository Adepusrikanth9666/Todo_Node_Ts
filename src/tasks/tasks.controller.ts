import { Task } from "./tasks.entity";
import { AppDataSource } from "../..";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { Response, Request } from "express";
import { validationResult } from "express-validator";
import { UpdateResult } from "typeorm";

class TaskController {
  // Method for get route

  public async getAll(req: Request, res: Response): Promise<Response> {
    // dealer the variable to hold all the tasks

    let allTasks: Task[];
    try {
      allTasks = await AppDataSource.getRepository(Task).find({
        order: {
          date: "ASC",
        },
      });

      //   convert the taks instance to an array of objects

      allTasks = instanceToPlain(allTasks) as Task[];

      return res.json(allTasks).status(200);
    } catch (errors) {
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }

  // Method for the Post route

  public async create(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new instance of the Task
    const newTask = new Task();

    // Add the required properties to teh Task Object
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    // Add the new task to the database
    let createTask: Task;

    try {
      createTask = await AppDataSource.getRepository(Task).save(newTask);

      // convert the task instance to an object
      createTask = instanceToPlain(createTask) as Task;

      return res.json(createTask).status(201);
    } catch (errors) {
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }

  // Method for update tasks

  public async update(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Try to find the task exists
    let task: Task | null;

    try {
      task = await AppDataSource.getRepository(Task).findOne({
        where: { id: req.body.id },
      });
    } catch (error) {
      return res.json({ error: "Internal Server Error" }).status(500);
    }

    // -Return 400 if the task is null

    if (!task) {
      return res
        .status(400)
        .json({ error: "The Task with teh give ID id no Exist" });
    }
    // Declare a variable for updateTask

    let updatedTask: UpdateResult;

    // Update a task in BD
    try {
      updatedTask = await AppDataSource.getRepository(Task).update(
        req.body.id,
        plainToInstance(Task, {
          status: req.body.status,
        })
      );
      // convert the updated task instance to an object
      updatedTask = instanceToPlain(updatedTask) as UpdateResult;

      return res.json(updatedTask).status(200);
    } catch (error) {
      return res.json({ error: "Internal Server Error" }).status(500);
    }
  }
}

export const taskController = new TaskController();
