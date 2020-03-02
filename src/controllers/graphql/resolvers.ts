import Task from "../../domain/Task";
import ITaskNewInput from "../../services/ITaskNewInput";
import ITaskPatchInput from "../../services/ITaskPatchInput";
import ITaskSearchInput from "../../services/ITaskSearchInput";
import TasksMapper from "../../services/TasksMapper";
import createValidator from "../../helpers/createValidator";
import schemaValidation from "../TasksController.schema";
import createError from "http-errors";

const tasksMapper: TasksMapper = new TasksMapper();
const validate = createValidator(schemaValidation);

const resolvers = {
  /**
   *
   */
  tasks: {
    /**
     *
     */
    async getAll(): Promise<Task[]> {
      return tasksMapper.search();
    },

    /**
     *
     */
    async get({ id }: { id: string }, context: any): Promise<Task> {
      validate("getTask", { id });
      const task = await tasksMapper.get({ id });
      if (!task) throw Error("Задача не найдена");
      return task;
    },

    /**
     *
     */
    async delete({ id }: { id: string }, context: any): Promise<boolean> {
      validate("deleteTask", { id });
      return tasksMapper.delete({ id });
    },

    /**
     *
     * @param sorting
     * @param offset
     * @param limit
     * @param context
     */
    async search(
      {
        sorting = [],
        offset,
        limit = 0
      }: ITaskSearchInput = {},
      context: any
    ): Promise<Task[]> {
      return tasksMapper.search({
        sorting,
        offset,
        limit
      });
    },

    /**
     *
     * @param params
     * @param context
     */
    async create({ params }: { params: ITaskNewInput }, context: any) {
      validate("createTask", params);
      const task = new Task(params);
      return tasksMapper.save(task);
    },

    /**
     *
     * @param params
     * @param context
     */
    async patch(
      { params }: { params: ITaskPatchInput },
      context: any
    ): Promise<Task> {
      validate("getTask", params);
      validate("updateTask", params);
      const task = await tasksMapper.get(<{ id: string }>params);
      if (!task) throw createError(404, "Задача не найдена");
      if (params.title !== undefined) task.title = params.title;
      if (params.priority !== undefined) task.priority = params.priority;
      return tasksMapper.save(task);
    }
  },

  /**
   *
   * @param args
   * @param context
   */
  hello: (args: { [key: string]: any }, context: any) => {
    return "Hello world!";
  }
};

export default resolvers;
