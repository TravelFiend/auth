const { Router } = require('express');
const User = require('../models/User');

const setSessionCookie = (res, token) => {
    res.cookie('session', token, {
        maxAge: 24 * 60 * 60 * 1000
    });
};

module.exports = new Router()
    .post('/signup', (req, res, next) => {
        User
            .create(req.body)
            .then(user => {
                setSessionCookie(res, user.authToken());
                res.send(user);
            })
            .catch(next);
    })

    .post('/login', (req, res, next) => {
        User
            .authorize(req.body)
            .then(user => {
                setSessionCookie(res, user.authToken());
                res.send(user);
            })
            .catch(next);
    });
