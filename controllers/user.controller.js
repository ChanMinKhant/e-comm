const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const redisClient = require('../config/redisClient');
const redisKey = require('../utils/redisKey');
const mongoose = require('mongoose');

// getAllUsers
exports.getAllUsers = asyncHandler(async (req, res) => {
  let users = {};
  users = JSON.parse(await redisClient.get(redisKey.users));

  if (users) {
    users = await User.find();
    await redisClient.setEx(redisKey.users, 10, JSON.stringify(users));
  }

  res.status(200).json({
    ok: true,
    results: users.length,
    data: users,
  });
});

// create user
exports.createUser = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.create({
    account: req.user.id,
    name,
    phone,
    address,
  });

  res.status(201).json({
    ok: true,
    message: 'User created successfully',
    data: user,
  });
});
