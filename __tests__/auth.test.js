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
});
