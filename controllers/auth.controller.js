const Account = require('../models/account.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/sendMail');
const AppError = require('../utils/AppError');
const asyncHandler = require('express-async-handler');

exports.register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // console.log(req.idd);
  // 1. whether email is exist in database
  // mgmg@gmail.com is exist but isVerifeied is false
  // -> can register again with this mail because not verified yet,
  // but we cannot save it again because email field is unique,
  // we already stored this mail. som we need to delete it first
  const account = await Account.findOne({ email });
  // throw new Error('test error');

  if (account && account?.isVerified === true) {
    next(new AppError('Email is already registered', 400));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);

  const otp = crypto.randomInt(100000, 1000000);
  console.log(otp);

  // const newAccount = new Account({
  //   email,
  //   password: hashPassword,
  //   otp,
  //   otpExpiration: new Date(Date.now() + 10 * 60 * 1000),
  // });

  // newAccount.save();

  const newAccount = await Account.findOneAndUpdate(
    { email },
    {
      email,
      password: hashPassword,
      otp,
      otpExpiration: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // send otp -> gmail
  await sendMail(email, 'Verify your email', `Your OTP is ${otp}`);

  return res.status(200).json({
    ok: true,
    message: 'Register successfully',
  });
});

exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const account = await Account.findOne({ email });

  // 1. whether email is exist in database
  if (!account) {
    next(new AppError('Email is not exist', 400));
  }

  // 2. whether OTP is valid
  if (account.otp !== otp) {
    next(new AppError('Invalid OTP', 400));
  }

  // 3. whether OTP is expired
  if (account.otpExpiration < new Date()) {
    next(new AppError('OTP is expired', 400));
  }

  // 4. verify the account
  account.isVerified = true;
  account.otp = null;
  account.otpExpiration = null;
  await account.save();

  return res.status(200).json({
    ok: true,
    message: 'OTP verified successfully',
  });
});

exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const account = await Account.findOne({ email });

  // 1. whether email is exist in database
  if (!account) {
    return res.status(400).json({
      ok: false,
      message: 'Email is not exist',
    });
  }
  // console.log(account);
  // 1.1 whether account is verified
  if (account.isVerified) {
    return res.status(400).json({
      ok: false,
      message: 'Account is already verified',
    });
  }

  // 2. generate new OTP
  const otp = crypto.randomInt(100000, 1000000);
  console.log(otp);
  // 3. update OTP and OTP expiration
  account.otp = otp;
  account.otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
  await account.save();

  // 4. send otp -> gmail
  await sendMail(email, 'Resend OTP', `Your new OTP is ${otp}`);

  return res.status(200).json({
    ok: true,
    message: 'Reset OTP successfully',
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const account = await Account.findOne({ email });

  // 1. whether email is exist in database
  if (!account) {
    return res.status(400).json({
      ok: false,
      message: 'Email is not exist',
    });
  }

  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  console.log(resetPasswordToken);

  account.resetPasswordToken = resetPasswordToken;
  account.resetPasswordExpiration = new Date(Date.now() + 30 * 60 * 1000);
  await account.save();

  // localhost:3000/api/v1/auth/reset-password/0c118a2d94edd838606622b5d07c9d24b60b3f0f0f991b19905ab918a5565b8f
  // send mail -> gmail
  await sendMail(
    email,
    'Reset Password',
    `Click <a href="http://localhost:3000/api/v1/auth/reset-password/${resetPasswordToken}">here</a> to reset your password.`,
  );

  return res.status(200).json({
    ok: true,
    message: 'Reset password token generated successfully',
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // 1. whether token is valid
  const account = await Account.findOne({ resetPasswordToken: token });
  if (!account) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid token',
    });
  }

  // 2. whether passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({
      ok: false,
      message: 'Passwords do not match',
    });
  }

  // 3. hash the new password
  const hashPassword = await bcrypt.hash(password, 10);
  account.password = hashPassword;

  // 4. clear the reset password token
  account.resetPasswordToken = null;
  await account.save();

  // 5. send mail -> gmail
  await sendMail(
    email,
    'Reset Password',
    'Your password has been reset successfully',
  );

  return res.status(200).json({
    ok: true,
    message: 'Password reset successfully',
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // 1. validate email and password
  console.log(email);
  console.log(password);
  const account = await Account.findOne({ email });

  if (!account || !account.isVerified) {
    return res.status(400).json({
      ok: false,
      message: 'Email or password is not correct',
    });
  }

  // 2. validate password
  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    return res.status(400).json({
      ok: false,
      message: 'Email or password is not correct',
    });
  }

  // 2. generate access token (JWT)
  const token = jwt.sign({ id: account._id, tokenVersion: account.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    expiresIn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  return res.status(200).json({
    ok: true,
    message: 'Login successfully',
    token,
  });
});

exports.testController = asyncHandler(async (req, res) => {
  console.log(req.user.id);
  const account = await Account.findById(req.user.id);
  return res.status(200).json({
    ok: true,
    message: 'user id: ' + req.user.id,
    account,
  });
});

exports.onlyAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'Only admin can access this route',
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    ok: true,
    message: 'Logout successful',
  });
});

exports.logoutAll = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.user.id);
  account.tokenVersion += 1;
  await account.save();
  res.clearCookie('token');
  const token = jwt.sign({ id: account._id, tokenVersion: account.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    expiresIn: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });
  
  return res.status(200).json({
    ok: true,
    message: 'Logout all successful',
    token,
  });
});