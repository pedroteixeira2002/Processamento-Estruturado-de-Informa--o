const express = require('express');
const TransferController = require('../controllers/TransferController');
const getTransferReportByMonth = TransferController.getTransferReportByMonth;

const router = express.Router();

const validateDateParams = (req, res, next) => {
    const { year, month } = req.params;
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    if (
        isNaN(yearInt) ||
        isNaN(monthInt) ||
        yearInt < 2000 || //new Date().getFullYear() > yearInt ||
        monthInt < 1 ||
        monthInt > 12
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid year or month. Please provide a valid year and month.',
        });
    }

    next();
};

router.get('/:year/:month', validateDateParams, getTransferReportByMonth);

module.exports = router;
