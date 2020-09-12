const express = require('express');
const { createApplication } = require('../controllers/applications');

const router = express.Router({ mergeParams: true });

router.post('/', createApplication);

module.exports = router;
