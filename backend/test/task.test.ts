import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

let userToken = '';
let taskId = '';

beforeAll(async () => {
  // Create a user strictly for task tests
  const res = await request(app).post('/api/v1/auth/register').send({
    name: 'Task Tester',
    email: 'tasktester@example.com',
    password: 'TaskPassword123!',
  });
  userToken = res.body.accessToken;
});

afterAll(async () => {
  await prisma.task.deleteMany({ where: { title: 'Jest Created Task' } });
  await prisma.user.deleteMany({ where: { email: 'tasktester@example.com' } });
  await prisma.$disconnect();
});

describe('Task Module Testing', () => {
  it('Should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Jest Created Task',
        description: 'Trying out endpoints via supertest',
        priority: 'HIGH',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.task.title).toBe('Jest Created Task');
    taskId = res.body.task.id;
  });

  it('Should fetch user tasks', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('Should fail to fetch tasks if no auth token is provided', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(401);
  });
});
