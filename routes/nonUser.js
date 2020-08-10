const express = require('express');

const frontController = require('../controllers/front');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/',frontController.getfront);

module.exports = router;
