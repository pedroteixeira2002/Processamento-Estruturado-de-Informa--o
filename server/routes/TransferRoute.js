const express = require('express');
const TransferController = require('../controllers/TransferController');
const getTransferReportByMonth = TransferController.getTransferReportByMonth;

const router = express.Router();

router.get('/report', getTransferReportByMonth);

module.exports = router;
