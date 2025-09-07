const express = require('express');
const router = express.Router();
const authRouter = require('../Routes/AuthRouter');
const userRouter = require('../Routes/UserRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);

module.exports = router;
