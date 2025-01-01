const express = require('express');
const { getTransferReportByMonth } = require('../controllers/transferController');

const router = express.Router();

router.get('/:year/:month', getTransferReportByMonth);

module.exports = router;
