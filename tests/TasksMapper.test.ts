import alasql from 'alasql';
import { v4 as uuid } from 'uuid';
import TasksMapper from '../src/services/TasksMapper';
import Task from '../src/domain/Task';

describe('TasksMapper', () => {

  beforeEach(() => {
    dbInit();
  });

  afterEach(() => {
    dbClear();
  });

  const tasksMapper = new TasksMapper();

  it('get', async () => {
    const tasksData = dbPopulate();

    const num = 1;
    const id = <string> tasksData[num][0];
    const title = tasksData[num][1];
    const priority = tasksData[num][2];

    const task = await tasksMapper.get({id});

    expect(task).toBeInstanceOf(Task);
    expect(task && task.id).toBe(id);
    expect(task && task.title).toBe(title);
    expect(task && task.priority).toBe(priority);
  });

  it('create', async () => {
    const title = 'Задача 4';
    const priority = 56;
    const task = new Task({title, priority});
    const savedTask = await tasksMapper.save(task);
    expect(savedTask).toBeInstanceOf(Task);
    expect(savedTask && savedTask.title).toBe(title);
    expect(savedTask && savedTask.priority).toBe(priority);
  });

  it('create with ID', async () => {
    const id = uuid();
    const title = 'Задача 4';
    const priority = 56;
    const task = new Task({id, title, priority});
    const savedTask = await tasksMapper.save(task);
    expect(savedTask).toBeInstanceOf(Task);
    expect(savedTask && savedTask.id).toBe(id);
    expect(savedTask && savedTask.title).toBe(title);
    expect(savedTask && savedTask.priority).toBe(priority);
  });

  it('save old', async () => {
    const tasksData = dbPopulate();

    const num = 1;
    const id = <string> tasksData[num][0];

    const newTitle = 'Задача 457865483';
    const newPriority = 99;

    const task = await tasksMapper.get({id});
    expect(task).toBeInstanceOf(Task);
    if (task) {
      task.title = newTitle;
      task.priority = newPriority;
    }
    const savedTask = await tasksMapper.save(<Task>task);
    expect(savedTask).toBeInstanceOf(Task);
    expect(savedTask && savedTask.title).toBe(newTitle);
    expect(savedTask && savedTask.priority).toBe(newPriority);
  });

  it('save new without ID', async () => {
    const title = 'Задача 457865483';
    const priority = 99;

    const task = new Task({title, priority});
    const savedTask = await tasksMapper.save(task);

    expect(savedTask).toBeInstanceOf(Task);
    expect(savedTask && savedTask.title).toBe(title);
    expect(savedTask && savedTask.priority).toBe(priority);
  });

  it('save new with ID', async () => {
    const id = uuid();
    const title = 'Задача 457865483';
    const priority = 99;

    const task = new Task({id, title, priority});
    const savedTask = await tasksMapper.save(task);

    expect(savedTask).toBeInstanceOf(Task);
    expect(savedTask && savedTask.id).toBe(id);
    expect(savedTask && savedTask.title).toBe(title);
    expect(savedTask && savedTask.priority).toBe(priority);
  });

  it('delete', async () => {
    const tasksData = dbPopulate();

    const num = 1;
    const id = <string> tasksData[num][0];

    await tasksMapper.delete({id});

    const task = await tasksMapper.get({id});

    expect(task).toBe(undefined);
  });

  it('search 0', async () => {
    dbPopulate();

    const tasks = await tasksMapper.search({});

    expect(tasks.length).toBe(3);
  });

  it('search 1', async () => {
    dbPopulate();

    const tasks = await tasksMapper.search({
      sorting: [
        {field: 'priority', order: 'desc'},
      ],
      offset: 0,
      limit: 1,
    });

    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Задача 2');
  });

  it('search 2', async () => {
    dbPopulate();

    const tasks = await tasksMapper.search({
      sorting: [
        {field: 'title', order: 'desc'},
      ],
      offset: 1,
      limit: 2,
    });

    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Задача 2');
    expect(tasks[1].title).toBe('Задача 1');
  });
});

/**
 *
 */
function dbInit() {
  alasql(`
    CREATE DATABASE test;
    USE test;
    CREATE TABLE tasks (
       id uuid NOT NULL,
       title varchar(255) NOT NULL,
       priority int NOT NULL DEFAULT 0,
       PRIMARY KEY (id)
    );
  `);
}

/**
 *
 */
function dbPopulate() {
  const tasksData = [
    ['Задача 1', 42],
    ['Задача 2', 100],
    ['Задача 3', 0],
  ].map(taskData => {
    taskData.unshift(uuid());
    return taskData;
  });
  tasksData.forEach(taskData => {
    alasql(`
      INSERT INTO tasks (id, title, priority)
      VALUES
        (?, ?, ?)
    `, taskData);
  });
  //console.log(alasql('SELECT * FROM tasks'));
  return tasksData;
}

/**
 *
 */
function dbClear() {
  alasql(`
    DROP DATABASE test;
  `);
}
