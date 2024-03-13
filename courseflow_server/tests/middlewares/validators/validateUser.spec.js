import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { validateUser } from '../../../middlewares/validators/validateUser.js';

const app = express();
app.use(express.json());
app.post('/users', validateUser, (req, res) => {
  res.status(201).json({ message: 'User created' });
});

describe('POST /users', () => {
  it('should validate user data', async () => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123456',
      dateOfBirth: new Date('2000-10-01'),
      educationalBackground: 'University degree'
    };

    const response = await request(app).post('/users').send(user);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: 'User created' });
  });

  it('should return 400 if user data is invalid', async () => {
    const user = {
      name: '',
      email: 'invalid email',
      password: 'short',
      dateOfBirth: '2025-01-01'
    };

    const response = await request(app).post('/users').send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});