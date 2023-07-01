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
let multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({ storage: storage });

const user_controller = require('../controllers/user.controller.js');

router.post('/login', user_controller.user_login);
router.post('/create', user_controller.user_create);
router.get('/list', checkToken, user_controller.user_list);
router.get('/:id', checkToken, user_controller.user_id);
router.put('/:id/update', checkToken, user_controller.user_update);
router.put('/:id/picture', checkToken, upload.single('picture'), user_controller.user_picture);
router.delete('/:id/delete', checkToken, user_controller.user_delete);

module.exports = router;