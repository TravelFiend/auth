require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

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
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    email: 'me@me.com',
                    __v: 0
                });
            });
    });
});
