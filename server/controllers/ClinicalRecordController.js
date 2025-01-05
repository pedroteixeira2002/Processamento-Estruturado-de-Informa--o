const connectToDb = require('../db');


exports.getClinicalReportByMonth = async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ success: false, message: "Year and month are required." });
    }

    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    try {
        const db = await connectToDb();
        const recordsCollection = db.collection('records_by_date');

        const pipeline = [];

        const result = await recordsCollection.aggregate(pipeline).toArray();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the report.',
        });
    }
};