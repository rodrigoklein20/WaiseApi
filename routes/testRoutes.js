const express = require('express');
const router = express.Router();
const testeController = require('../controls/testController');

router.get('/', testeController.getTeste);

module.exports = router;
