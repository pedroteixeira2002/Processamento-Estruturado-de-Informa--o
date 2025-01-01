const express = require('express');
const  ClinicalReport = require('../controllers/clinicalRecordController.js');

const router = express.Router();

router.get('/:year/:month', ClinicalReport.getClinicalReportByMonth);

module.exports = router;
