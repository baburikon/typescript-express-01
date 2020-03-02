import request from "supertest";
import { SuperAgent, SuperAgentRequest, Response } from "superagent";
import app from "../src/app.worker";
import { dbInit, dbClear, dbPopulate } from "./dbMocks/dbMockHelpers";

const superTest: SuperAgent<SuperAgentRequest> = request(app);
const createAgent = () =>
  superTest
    .post("/graphql")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

describe("tasks.routes", () => {
  beforeEach(() => {
    dbInit();
  });

  afterEach(() => {
    dbClear();
  });

  it("hello", async () => {
    const response: Response = await createAgent().send({
      query: `{
        hello
      }`
    });
    expect(response.status).toBe(200);
    expect(response.body.data.hello).toBe("Hello world!");
  });

  it("неверный запрос", async () => {
    const response: Response = await createAgent().send({
      query: `{
        tasks4578457845 {
          id
          title
          priority
        }
      }`
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(400);
  });

  it("tasks getAll", async () => {
    dbPopulate();
    const response: Response = await createAgent().send({
      query: `{
        tasks {
          getAll {
            id
            title
            priority
          }
        }
      }`
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.getAll.length).toBe(3);
  });

  it("tasks search all with params without sorting", async () => {
    const tasksData = dbPopulate();
    const response: Response = await createAgent().send({
      query: `{
        tasks {
          search (offset: 1, limit: 2) {
            id
            title
            priority
          }
        }
      }`
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.search.length).toBe(2);
  });

  it("tasks search all with params", async () => {
    const tasksData = dbPopulate();
    const response: Response = await createAgent().send({
      query: `{
        tasks {
          search(
            sorting: [
              {
                field: priority,
                order: desc,
              },
            ],
            offset: 0,
            limit: 1,
          ) {
            id
            title
            priority
          }
        }
      }`
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.search.length).toBe(1);
    expect(response.body.data.tasks.search[0].title).toBe("Задача 2");
  });

  it("tasks create", async () => {
    const response: Response = await createAgent().send({
      query: `
        mutation {
          tasks {
            create(params: {title: "Задача 78", priority: 43}) {
              id
              title
              priority
            }
          }
        }
      `
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.create.title).toBe("Задача 78");
  });

  it("tasks create with variables", async () => {
    const response: Response = await createAgent().send({
      query: `
        mutation($taskTitle: String!, $taskPriority: Int) {
          tasks {
            create(params: {title: $taskTitle, priority: $taskPriority}) {
              id
              title
              priority
            }
          }
        }
      `,
      variables: {
        taskTitle: "Задача 78",
        taskPriority: 43
      }
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.create.title).toBe("Задача 78");
  });

  it("tasks create with variables 2", async () => {
    const response: Response = await createAgent().send({
      query: `
        mutation($params: TaskNewInput) {
          tasks {
            create(params: $params) {
              id
              title
              priority
            }
          }
        }
      `,
      variables: {
        params: {
          id: undefined,
          title: "Задача 78",
          priority: 43
        }
      }
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.create.title).toBe("Задача 78");
  });

  it("task patch", async () => {
    const tasksData = dbPopulate();
    const taskId = tasksData[1][0];
    const response: Response = await createAgent().send({
      query: `
        mutation($taskId: ID!, $taskTitle: String, $taskPriority: Int) {
          tasks {
            patch(params: {id: $taskId, title: $taskTitle, priority: $taskPriority}) {
              id
              title
              priority
            }
          }
        }
      `,
      variables: {
        taskId,
        taskTitle: "Задача 78",
        taskPriority: 43
      }
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.patch.title).toBe("Задача 78");
    expect(response.body.data.tasks.patch.priority).toBe(43);
  });

  it("tasks get", async () => {
    const tasksData = dbPopulate();
    const taskId = tasksData[1][0];
    const response: Response = await createAgent().send({
      query: `
        query($taskId: ID!) {
          tasks {
            get(id: $taskId) {
              id
              title
              priority
            }
          }
        }
      `,
      variables: {
        taskId,
      }
    });
    //console.log(JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.data.tasks.get.title).toBe("Задача 2");
    expect(response.body.data.tasks.get.priority).toBe(100);
  });

  it("task delete", async () => {
    const tasksData = dbPopulate();
    const taskId = tasksData[1][0];
    const response: Response = await createAgent().send({
      query: `
        mutation($taskId: ID!) {
          tasks {
            delete(id: $taskId)
          }
        }
      `,
      variables: {
        taskId,
      }
    });
    //console.log(JSON.stringify(response.body, null, 2));
    const response2: Response = await createAgent().send({
      query: `
        query($taskId: ID!) {
          tasks {
            get(id: $taskId) {
              id
            }
          }
        }
      `,
      variables: {
        taskId,
      }
    });
    //console.log(JSON.stringify(response2.body, null, 2));
    expect(response2.status).toBe(400);
    expect(response2.body.errors[0].message).toBe('Задача не найдена');
  });

});
