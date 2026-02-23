import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'testjest@example.com' } });
  await prisma.$disconnect();
});

describe('Auth Module Testing', () => {
  let userToken = '';

  it('Should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Jest User',
      email: 'testjest@example.com',
      password: 'StrongPassword123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();

    userToken = res.body.accessToken;
  });

  it('Should login the newly registered user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'testjest@example.com',
      password: 'StrongPassword123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
  });

  it('Should fail login with wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'testjest@example.com',
      password: 'WrongPassword123!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
