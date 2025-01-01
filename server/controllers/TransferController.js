const Transfer = require('../models/Transfer');

exports.getTransferReportByMonth = async (req, res) => {
    const { year, month } = req.params;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const transfers = await Transfer.find({
            Data_Transferencia: { $gte: startDate, $lte: endDate },
        });

        res.status(200).json({ success: true, data: transfers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
