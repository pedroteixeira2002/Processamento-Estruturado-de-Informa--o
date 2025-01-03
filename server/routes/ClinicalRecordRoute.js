const express = require('express');
const ClinicalReport = require('../controllers/clinicalRecordController.js');
const getClinicalReportByMonth = ClinicalReport.getClinicalReportByMonth;

const router = express.Router();

router.get('/report', getClinicalReportByMonth);

module.exports = router;
