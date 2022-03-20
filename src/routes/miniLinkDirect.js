const express = require('express');
const router = express.Router();
const MiniLinkDirect = require('../app/controllers/MiniLinkDirect');

router.post('/', MiniLinkDirect.create);
router.get('/:link', MiniLinkDirect.index);

module.exports = router;