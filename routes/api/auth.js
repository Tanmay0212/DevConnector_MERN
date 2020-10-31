const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//@route GET api/auth
//@desc test route
//@access Public

router.get('/', auth, (res, req) => res.send('auth route'));

module.exports = router;
