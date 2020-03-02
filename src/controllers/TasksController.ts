import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import schema from "./TasksController.schema";
import Task from "../domain/Task";
import TasksMapper from "../services/TasksMapper";
import createValidator from "../helpers/createValidator";
import errors from "../helpers/controllerErrorsDecorator";

/**
 *
 */
export default class TasksController {
  /**
   *
   */
  protected tasksMapper: TasksMapper;
  protected validate: Function;

  /**
   *
   */
  constructor() {
    this.tasksMapper = new TasksMapper();
    this.validate = createValidator(schema);
  }

  /**
   *
   * @param req
   * @param res
   */
  @errors
  async searchTasks(req: Request, res: Response): Promise<void> { //console.log(req.body);
    this.validate("getTasks", req.body);
    const tasks = await this.tasksMapper.search(req.body);
    res.status(200).json({ data: tasks });
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  @errors
  async getTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.validate("getTask", req.params);
    const task = await this.tasksMapper.get(<{ id: string }>req.params);
    if (!task) throw createError(404, "Задача не найдена");
    res.status(200).json({ data: task });
  }

  /**
   *
   * @param req
   * @param res
   */
  @errors
  async createTask(req: Request, res: Response): Promise<void> {
    this.validate("createTask", req.body);
    const task = new Task(req.body);
    const savedTask = await this.tasksMapper.save(task);
    res.status(200).json({ data: savedTask });
  }

  /**
   *
   * @param req
   * @param res
   */
  @errors
  async updateTask(req: Request, res: Response): Promise<void> {
    this.validate("getTask", req.params);
    this.validate("updateTask", req.body);
    const task = await this.tasksMapper.get(<{ id: string }>req.params);
    if (!task) throw createError(404, "Задача не найдена");
    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    const savedTask = await this.tasksMapper.save(task);
    res.status(200).json({ data: savedTask });
  }

  /**
   *
   * @param req
   * @param res
   */
  @errors
  async deleteTask(req: Request, res: Response): Promise<void> {
    this.validate("deleteTask", req.params);
    const result = await this.tasksMapper.delete(<{ id: string }>req.params);
    res.status(200).json({result});
  }
}
