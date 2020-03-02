import alasql from "alasql";
import {v4 as uuid} from "uuid";

/**
 *
 */
export function dbInit() {
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
export function dbPopulate() {
  const tasksData = [
    ["Задача 1", 42],
    ["Задача 2", 100],
    ["Задача 3", 0]
  ].map(taskData => {
    taskData.unshift(uuid());
    return taskData;
  });
  tasksData.forEach(taskData => {
    alasql(
      `
      INSERT INTO tasks (id, title, priority)
      VALUES
        (?, ?, ?)
    `,
      taskData
    );
  });
  //console.log(alasql('SELECT * FROM tasks'));
  return tasksData;
}

/**
 *
 */
export function dbClear() {
  alasql(`
    DROP DATABASE test;
  `);
}
