const jwt = require('jsonwebtoken');
const Account = require('../models/account.model');

exports.verifyJwt = async (req, res, next) => {
  let token = req.headers?.authorization?.split(' ')[1];
  // console.log(req.cookies);
  if (!token) {
    token = req.cookies?.token;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById(decoded.id);
    if (!account) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (account.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    req.user.role = account.role;
    // console.log(abcdd);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// allowTo('admin', 'user')
// allowTo('admin', edit)
exports.allowTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
