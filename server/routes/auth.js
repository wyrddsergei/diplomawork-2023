const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const User = require('../models/User')

const MY_SECRET = 'my-secret-message'
const EXPIRE_TIME = 24 * 60 * 60 * 1000; // 1 day

// Error messages
const errorMessages = {
  registration: 'An error occurred during registration',
  login: 'An error occurred during login',
  unauthenticated: 'Unauthenticated',
};

// Middleware to handle errors
const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).send({
    message: 'Internal Server Error :)',
  });
};

router.post('/register', asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    login: req.body.login,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  const result = await user.save();

  const { password, ...data } = await result.toJSON();

  res.send(data);
}));

router.post('/login', asyncHandler(async (req, res) => {
  const user = await User.findOne({ login: req.body.login });

  if (!user) {
    return res.status(404).send({
      message: 'User has not been found',
    });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: 'Invalid credentials',
    });
  }

  const token = jwt.sign({ _id: user._id }, MY_SECRET);

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: EXPIRE_TIME,
  });

  res.send({
    message: 'Success',
  });
}));

router.get('/profile', asyncHandler(async (req, res) => {
  const cookie = req.cookies['jwt'];

  if (!cookie) {
    return res.status(200).json({ message: 'Unauthorized' });
  }

  const claims = jwt.verify(cookie, MY_SECRET);

  if (!claims) {
    return res.status(200).json({ message: 'Unauthorized' });
  }

  const user = await User.findOne({ _id: claims._id });

  if (!user) {
    return res.status(200).json({ message: 'Unauthorized' });
  }

  const { password, ...data } = await user.toJSON();
 
  res.status(200).json({ message: 'Authorized', user: data });
}));



router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });

  res.send({
    message: 'Successfully logged out',
  });
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;