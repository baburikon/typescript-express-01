import express from 'express';
import TasksController from '../controllers/TasksController';

const router = express.Router();
const tasksController = new TasksController();

router.route('/1.0/tasks/search')
  .post(tasksController.searchTasks.bind(tasksController)); // фильтрация Задач

router.route('/1.0/tasks/:id')
  .get(tasksController.getTask.bind(tasksController)) // Задача
  .patch(tasksController.updateTask.bind(tasksController)) // изменение Задачи
  .delete(tasksController.deleteTask.bind(tasksController)); // удаление Задачи

router.route('/1.0/tasks')
  .get(tasksController.searchTasks.bind(tasksController)) // все Задачи
  .post(tasksController.createTask.bind(tasksController)); // создание Задачи

export default router;
