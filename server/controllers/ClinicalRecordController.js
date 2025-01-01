const ClinicalRecord = require('../models/ClinicalRecord');

exports.getClinicalReportByMonth = async (req, res) => {
    const { year, month } = req.params;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const records = await ClinicalRecord.find({
            Data_Atendimento: { $gte: startDate, $lte: endDate },
        });

        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
