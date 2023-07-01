const router = require('express').Router();
const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
};
const passwordReset_controller = require('../controllers/passwordReset.controller.js');

router.post('/', passwordReset_controller.passwordReset_request);
router.get('/:token', passwordReset_controller.passwordReset_reset);

module.exports = router;