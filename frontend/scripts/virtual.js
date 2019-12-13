"use strict";

const request = require("request");

module.exports = function(app) {
    
    app.post('/user', async function(req, res) {
        const options = {
            url: `${app.backend}/user`,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            form: {
                username: req.body.username,
                password: req.body.password
            },
        };
        request(options, function(err, backend_res) {
            if (backend_res.statusCode !== 201) {
                let {error} = JSON.parse(backend_res.body);
                res.status(backend_res.statusCode).send({error: error});
            } else {
                let data = JSON.parse(backend_res.body);
                req.session.regenerate(function() {
                    req.session.username = data.username;
                    res.status(201).send({username: data.username});
                });
            }
        });
    });

    app.post('/login', function(req, res) {
        const options = {
            url: `${app.backend}/login`,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            form: {
                username: req.body.username,
                password: req.body.password
            },
        };
        request(options, function(err, backend_res) {
            if (backend_res.statusCode !== 200) {
                let {error} = JSON.parse(backend_res.body);
                res.status(backend_res.statusCode).send({error: error});
            } else {
                let data = JSON.parse(backend_res.body);
                req.session.regenerate(function() {
                    req.session.username = data.username;
                    res.status(201).send({username: data.username});
                });
            }
        });
    });

    app.delete('/login', function(req, res) {
        if (req.session.username) {
            req.session.destroy(function() {
                res.status(204).end();
            })
        } else {
            res.status(200).end();
        }
    });

    app.get('/user/:username/scores', function(req, res) {
        const options = {
            url: `${app.backend}/user/${req.params.username}/scores`,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        };
        request(options, function(err, backend_res) {
            if (backend_res.statusCode !== 200) {
                res.status(backend_res.statusCode).send({error: backend_res.statusMessage});
            } else {
                let data = JSON.parse(backend_res.body);
                res.status(200).send(data);
            }
        });
    }); 

    app.post('/scores', function(req, res) {
        const options = {
            url: `${app.backend}/scores/${req.session.username}`,
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: {
                score: req.body.score
            },
            json: true
        };
        request(options, function(err, backend_res) {
            if (backend_res.statusCode !== 201) {
                res.status(backend_res.statusCode).send({error: backend_res.statusMessage});
            } else {
                res.status(201).send(backend_res.body);
            }
        });
    });

    app.get('/scores', function(req, res) {
        const options = {
            url: `${app.backend}/scores`,
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        };
        request(options, function(err, backend_res) {
            if (backend_res.statusCode !== 200) {
                res.status(backend_res.statusCode).send({error: backend_res.statusMessage});
            } else {
                let data = JSON.parse(backend_res.body);
                res.status(200).send({scores: data});
            }
        });
    });

}