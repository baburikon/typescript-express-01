import request from "supertest";
import { SuperAgent, SuperAgentRequest, Response } from "superagent";
import app from "../src/app.worker";
import { dbInit, dbClear, dbPopulate } from "./dbMocks/dbMockHelpers";

const agent: SuperAgent<SuperAgentRequest> = request(app);

describe("tasks.routes", () => {
  beforeEach(() => {
    dbInit();
  });

  afterEach(() => {
    dbClear();
  });

  it("get /api/1.0/tasks with ID", async () => {
    const tasksData = dbPopulate();
    const id = tasksData[1][0];
    const response: Response = await agent.get("/api/1.0/tasks/" + id);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Задача 2");
  });

  it("get /api/1.0/tasks with invalid ID ", async () => {
    const response: Response = await agent.get("/api/1.0/tasks/zzz");
    expect(response.status).toBe(400);
    //console.log(response.body.errors);
    expect(response.body.errors[0].message).toBe('Ошибка валидации: поле «.id» должно соответствовать формату "uuid"');
  });

  it("get /api/1.0/tasks with not exist ID ", async () => {
    const response: Response = await agent.get(
      "/api/1.0/tasks/7082385d-2821-4af2-8913-aeb8713404f0"
    );
    expect(response.status).toBe(404);
    expect(response.body.errors[0].message).toBe("Задача не найдена");
  });

  it("get /api/1.0/tasks without ID", async () => {
    dbPopulate();
    const response: Response = await agent
      .get("/api/1.0/tasks")
      .set("Content-Type", "application/json")
      .send({});
    //console.log(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
  });

  it("get /api/1.0/tasks all", async () => {
    dbPopulate();
    const response: Response = await agent
      .get("/api/1.0/tasks")
      .set("Content-Type", "application/json")
      .send({});
    //console.log(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
  });

  it("post /api/1.0/tasks/search all", async () => {
    dbPopulate();
    const response: Response = await agent
      .post("/api/1.0/tasks/search")
      .set("Content-Type", "application/json")
      .send({});
    //console.log(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
  });

  it("post /api/1.0/tasks/search", async () => {
    dbPopulate();
    const response: Response = await agent
      .post("/api/1.0/tasks/search")
      .set("Content-Type", "application/json")
      .send({
        sorting: [
          {
            field: "priority",
            order: "desc"
          }
        ],
        limit: 1
      });
    //console.log(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].title).toBe('Задача 2');
  });

  it("post /api/1.0/tasks with ID", async () => {
    const id = 'a49060e9-48bc-4226-9975-751e94aee10b';
    const title = 'Задача 547457';
    const priority = 13;
    const response: Response = await agent
      .post("/api/1.0/tasks")
      .set("Content-Type", "application/json")
      .send({
        id,
        title,
        priority,
      });
    //console.log(response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(id);
    expect(response.body.data.title).toBe(title);
    expect(response.body.data.priority).toBe(priority);
  });

  it("post /api/1.0/tasks without ID", async () => {
    const title = 'Задача 547457';
    const priority = 13;
    const response: Response = await agent
      .post("/api/1.0/tasks")
      .set("Content-Type", "application/json")
      .send({
        title,
        priority,
      });
    //console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe(title);
    expect(response.body.data.priority).toBe(priority);
  });

  it("delete /api/1.0/tasks with ID", async () => {
    const tasksData = dbPopulate();
    const id = tasksData[1][0];

    const response1: Response = await agent.get("/api/1.0/tasks/" + id);
    expect(response1.status).toBe(200);

    await agent.delete("/api/1.0/tasks/" + id);

    const response2: Response = await agent.get("/api/1.0/tasks/" + id);
    expect(response2.status).toBe(404);
    expect(response2.body.errors[0].message).toBe('Задача не найдена');
  });

  it("patch /api/1.0/tasks", async () => {
    const tasksData = dbPopulate();
    const id = tasksData[1][0];
    const newTitle = 'Задача 547457';
    const newPriority = 13;
    const response: Response = await agent
      .patch("/api/1.0/tasks/"+id)
      .set("Content-Type", "application/json")
      .send({
        title: newTitle,
        priority: newPriority,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe(newTitle);
    expect(response.body.data.priority).toBe(newPriority);
  });

});
