import { PoolClient, QueryResult } from 'pg';
import Task from '../domain/Task';
import ITaskSearchInput from './ITaskSearchInput';
import dbPool from '../services/dbPool';

/**
 *
 */
export default class TasksMapper {

  /**
   *
   * @param id
   */
  async get({ id }: { id: string }): Promise<Task | undefined> {
    const db: PoolClient = await dbPool.connect();
    let res: QueryResult;
    try {
      res = await db.query(
        `
        SELECT *
        FROM tasks
        WHERE id=$1
      `,
        [id]
      );
    } finally {
      db.release();
    }
    const row = res.rows[0];
    return row ? this._load(row) : undefined;
  }

  /**
   *
   * @param sorting
   * @param offset
   * @param limit
   */
  async search({
    sorting = [],
    offset,
    limit = 0
  }: ITaskSearchInput = {}): Promise<Task[]> {
    const db: PoolClient = await dbPool.connect();
    let res: QueryResult;
    try {
      res = await db.query(
        `
        SELECT *
        FROM tasks
        ${
          sorting.length
            ? "ORDER BY " +
              sorting.map(sort => sort.field + " " + sort.order).join(", ")
            : ""
        }
        ${limit ? "LIMIT " + limit : ""}
        ${offset ? "OFFSET " + offset : ""}
      `
      );
    } finally {
      db.release();
    }
    return res.rows.map(row => {
      return this._load(row);
    });
  }

  /**
   *
   * @param task
   */
  async save(task: Task): Promise<Task> {
    const db: PoolClient = await dbPool.connect();
    try {
      const resExist: QueryResult = await db.query(
        `
        SELECT id
        FROM tasks
        WHERE id=$1
      `,
        [task.id]
      );
      const exist = <boolean>resExist.rows[0];
      if (exist) {
        await db.query(
          `
            UPDATE tasks
            SET
              title=$2,
              priority=$3
            WHERE id=$1
          `,
          [task.id, task.title, task.priority]
        );
      } else {
        await db.query(
          `
            INSERT INTO tasks (id, title, priority)
            VALUES ($1, $2, $3)
          `,
          [task.id, task.title, task.priority]
        );
      }
    } finally {
      db.release();
    }
    const savedTask = await this.get({ id: task.id });
    if (!savedTask) throw new Error("Сохранить задачу не удалось");
    return savedTask;
  }

  /**
   *
   * @param id
   */
  async delete({ id }: { id: string }): Promise<boolean> {
    const db: PoolClient = await dbPool.connect();
    try {
      await db.query(
        `
        DELETE FROM tasks
        WHERE id=$1
      `,
        [id]
      );
    } finally {
      db.release();
    }
    return true;
  }

  /**
   *
   * @param id
   * @param title
   * @param priority
   * @private
   */
  protected _load({
    id,
    title,
    priority
  }: {
    id: string;
    title: string;
    priority: number;
  }): Task {
    return new Task({ id, title, priority });
  }
}
