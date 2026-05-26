const router = require('express').Router();
const {
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  login,
  testController,
  onlyAdmin,
  logout,
  logoutAll,
} = require('../controllers/auth.controller');
const { verifyJwt, allowTo } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate');
const {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
} = require('../schemas/authSchema');

router.post('/register', validate(registerSchema), register);

router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);

router.post('/resend-otp', validate(resendOtpSchema), resendOtp);

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

router.post(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  resetPassword,
);

router.post('/login', validate(loginSchema), login);

router.post('/test', verifyJwt, testController);

// admin route 
router.post('/only-admin', verifyJwt, allowTo('admin') , onlyAdmin);

// logout
router.post('/logout', verifyJwt, logout);

router.post('/logout-all', verifyJwt, logoutAll);

// logout all devices
// router.post('/logout-all', (req, res) => {
//   // clear all tokens

// });

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMGQzMzBjMzg0MGI5ZTljMmJlMTI4YiIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzc5NTA5NzIzLCJleHAiOjE4MTEwNDU3MjN9.ts6tf6fdP-KeGavGYZjFjkaqbHgMnaRKE0pR9NfrKu8