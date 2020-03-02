import Ajv from "ajv";

/**
 *
 */
const task = {
  $id: "task",
  type: "object",
  properties: {
    id: {
      description: "Идентификатор (UUID) задачи",
      $comment: "https://postgrespro.ru/docs/postgresql/9.4/datatype-uuid",
      type: "string",
      format: "uuid",
    },
    title: {
      description: "Название задачи",
      type: "string",
      maxLength: 255,
    },
    priority: {
      description: "Приоритет задачи",
      type: "integer",
      minimum: 0,
      maximum: 100,
    }
  }
};

/**
 *
 */
const getTask = {
  $id: "getTask",
  type: "object",
  properties: {
    id: { $ref: "task#/properties/id" }
  },
  required: ["id"]
};

/**
 *
 */
const getTasks = {
  $id: "getTasks",
  type: "object",
  properties: {
    sorting: {
      description: "Параметры [{поле, порядок}] сортировки",
      type: "array",
      items: {
        type: "object",
        properties: {
          field: {
            type: "string",
            enum: ["title", "priority"],
          },
          order: {
            type: "string",
            enum: ["asc", "desc"],
          }
        }
      }
    },
    offset: {
      description: "Сколько задач надо пропустить",
      type: "integer",
      minimum: 0,
    },
    limit: {
      description: "Количество задач",
      type: "integer",
      minimum: 0,
    }
  }
};

/**
 *
 */
const deleteTask = {
  $id: "deleteTask",
  type: "object",
  properties: {
    id: { $ref: "task#/properties/id" }
  },
  required: ["id"]
};

/**
 *
 */
const createTask = {
  $id: "createTask",
  type: "object",
  properties: {
    id: { $ref: "task#/properties/id" },
    title: { $ref: "task#/properties/title" },
    priority: { $ref: "task#/properties/priority" }
  },
  required: ["title"]
};

/**
 *
 */
const updateTask = {
  $id: "updateTask",
  type: "object",
  properties: {
    title: { $ref: "task#/properties/title" },
    priority: { $ref: "task#/properties/priority" }
  },
};

const ajv = new Ajv({
  allErrors: true,
  schemas: [
    task,
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  ],
});

export default ajv;
