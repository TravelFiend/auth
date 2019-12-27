require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('should sign up a user with email/pw', () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({ email: 'me@me.com', password: 'meme23' })
            .then(res => {
                expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    email: 'me@me.com',
                    __v: 0
                });
            });
    });

    it('should log a user in with email/pw', async() => {
        const user = await User.create({
            email: 'me@me.com',
            password: 'meme23'
        });

        return request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'me@me.com', password: 'meme23' })
            .then(res => {
                expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
                expect(res.body).toEqual({
                    _id: user.id,
                    email: 'me@me.com',
                    __v: 0
                });
            });
    });

    it('should fail login with bad email', async() => {
        await User.create({
            email: 'me@me.com',
            password: 'meme23'
        });

        return request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'you@you.com', password: 'meme23' })
            .then(res => {
                expect(res.status).toEqual(401);
                expect(res.body).toEqual({
                    status: 401,
                    message: 'Invalid email or password'
                });
            });
    });

    it('should fail login with bad password', async() => {
        await User.create({
            email: 'me@me.com',
            password: 'meme23'
        });

        return request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'me@me.com', password: 'wrong' })
            .then(res => {
                expect(res.status).toEqual(401);
                expect(res.body).toEqual({
                    status: 401,
                    message: 'Invalid email or password'
                });
            });
    });

    it('should verify is a user is logged in', async() => {
        const user = await User.create({
            email: 'me@me.com',
            password: 'meme23'
        });

        const agent = request.agent(app);

        await agent
            .post('/api/v1/auth/login')
            .send({ email: 'me@me.com', password: 'meme23' });

        return agent
            .get('/api/v1/auth/verify')
            .then(res => {
                expect(res.body).toEqual({
                    _id: user.id,
                    email: 'me@me.com',
                    __v: 0
                });
            });
    });
});
