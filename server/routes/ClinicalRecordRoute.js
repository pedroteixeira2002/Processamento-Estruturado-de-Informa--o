const express = require('express');
const { getClinicalReportByMonth } = require('../controllers/clinicalController');

const router = express.Router();

router.get('/:year/:month', getClinicalReportByMonth);

module.exports = router;
