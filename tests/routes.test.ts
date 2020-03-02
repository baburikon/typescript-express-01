import request from 'supertest';
import { SuperAgent, SuperAgentRequest, Response } from 'superagent';
import app from '../src/app.worker';

const agent: SuperAgent<SuperAgentRequest> = request(app);

describe('routes', () => {

  it('не существующий путь', async () => {
    const response: Response = await agent.get('/zzzzzzzzzzzzzzz'); //console.log(response.body);
    expect(response.status).toBe(404);
  });

});
