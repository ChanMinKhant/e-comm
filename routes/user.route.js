const router = require('express').Router();

const { getAll, getUser } = require('../controllers/user.controller');
const { allowTo } = require('../middlewares/auth.middleware');
const { jwtVerify } = require('../middlewares/jwt.middleware');

// router.get('/', jwtVerify, allowTo('admin'), getAll);
router.get('/', getAll);
router.get('/:id', jwtVerify, allowTo('admin'), getUser);
router.post('/', jwtVerify, createUser);
router.patch('/:id', jwtVerify, updateUsers);
router.delete('/:id', jwtVerify, deleteUsers);

module.exports = router;
