const router = require('express').Router();

const { getAllUsers, createUser } = require('../controllers/user.controller');
const { allowTo } = require('../middlewares/auth.middleware');
const { verifyJwt } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate');
const { createUserSchema } = require('../schemas/userSchema');

// router.get('/', jwtVerify, allowTo('admin'), getAll);
router.get('/', verifyJwt, allowTo('user'), getAllUsers);
// router.get('/:id', verifyJwt, allowTo('user'), getUser);
router.post(
  '/',
  validate(createUserSchema),
  verifyJwt,
  allowTo('user'),

  createUser,
);
// router.patch('/:id', verifyJwt, updateUsers);
// router.delete('/:id', verifyJwt, deleteUsers);

module.exports = router;
