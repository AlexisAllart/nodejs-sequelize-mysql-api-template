const jwt = require('jsonwebtoken');
const jwtOptions = {
    expiresIn: '24h'
};
const db = require('../models/index.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Login
exports.user_login = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    db.user.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            res.sendStatus(404);
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                res.status(500).json(err);
            }
            if (!result) {
                res.sendStatus(401);
            }
            delete user.password;
            jwt.sign(
                user, process.env.JWT_SECRET, jwtOptions,
                (err, token) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.status(200).json(token);
                    }
                });
        });
    }).catch(err => {
        res.status(500).json(err);
    });
}

// Create
exports.user_create = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            res.status(500).json(err);
        }
        db.user.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hash,
            role: 'user',
            picture: './assets/img/profile.svg',
        }).then(user => {
            delete user.dataValues.password;
            res.status(200).json(user);
        }).catch(err => {
            res.status(500).json(err);
        });
    });
}

// List (token protected)
exports.user_list = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.status(403).json(err);
        }
        db.user.findByPk(authData.id).then(user => {
            if (!user) {
                res.sendStatus(401);
            }
            db.user.findAll({
                attributes: {
                    exclude: 'password'
                }
            }).then(users => {
                res.status(200).json(users);
            }).catch(err => {
                res.status(500).json(err);
            });
        }).catch(err => {
            res.status(500).json(err);
        });
    });
}

// Id (token protected)
exports.user_id = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.status(403).json(err);
        }
        db.user.findByPk(authData.id).then(data => {
            db.user.findByPk(req.params.id, {
                attributes: {
                    exclude: 'password'
                }
            }).then(user => {
                res.status(200).json(user);
            }).catch(err => {
                res.status(500).json(err);
            });
        }).catch(err => {
            res.status(500).json(err);
        });
    });
}

// Update (token protected)
exports.user_update = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        if (authData.id == req.params.id || authData.role == 'admin') {
            db.user.findByPk(req.params.id).then(user => {
                let updated = {};
                req.body.firstName ? updated.firstName = req.body.firstName : updated.firstName = user.firstName;
                req.body.lastName ? updated.lastName = req.body.lastName : updated.lastName = user.lastName;
                req.body.userName ? updated.userName = req.body.userName : updated.userName = user.userName;
                if (req.body.password) {
                    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                        if (err) {
                            res.status(500).json(err);
                        }
                        updated.password = hash;
                    });
                } else {
                    updated.password = user.password;
                }
                db.user.update(
                    updated, {
                        where: {
                            id: req.params.id
                        }
                    }).then(data => {
                    res.status(200).json(data);
                }).catch(err => {
                    res.status(500).json(err);
                });
            }).catch(err => {
                res.status(500).json(err);
            });
        } else {
            res.sendStatus(401);
        }
    });
}

// Upload picture (token protected)
exports.user_picture = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.status(403).json(err);
        }
        if (authData.id == req.params.id || authData.role == 'admin') {
            db.user.update({
                picture: './uploads/' + req.file.filename
            }, {
                where: {
                    id: req.params.id
                }
            }).then(data => {
                res.status(200).json('./uploads/' + req.file.filename);
            }).catch(err => {
                res.status(500).json(err);
            });
        } else {
            res.sendStatus(401);
        }
    });
}

// Delete (token protected)
exports.user_delete = (req, res) => {
    res.setHeader('Content-type', 'application/json ; charset=utf-8');
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            res.status(403).json(err);
        }
        if (authData.id == req.params.id || authData.role == 'admin') {
            db.user.destroy({
                where: {
                    id: req.params.id
                }
            }).then(user => {
                res.status(200).json(user);
            }).catch(err => {
                res.status(500).json(err);
            });
        } else {
            res.sendStatus(401);
        }
    });
}