const connectToDb = require('../db');


exports.getClinicalReportByMonth = async (req, res) => {
    const {year, month} = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    try {
        const db = await connectToDb();
        const recordsCollection = db.collection('records_new');
        const pipeline = [
                {
                    $match: {
                        Data_Atendimento: {$gte: startDate, $lte: endDate},
                    },
                },
                {
                    $project: {
                        _id: 1,
                        Data_Atendimento: 1,
                        Registos: 1,
                    },
                },
                {
                    $unwind: "$Registos.Diagnostico",
                },
                {
                    $unwind: "$Registos.Tratamento",
                },
                {
                    $group: {
                        _id: "$_id",
                        Data_Atendimento: {$first: "$Data_Atendimento"},  // Pega a primeira data
                        Diagnosticos: {$push: "$Registos.Diagnostico"},  // Lista de diagnósticos
                        Tratamentos: {$push: "$Registos.Tratamento"},  // Lista de tratamentos
                    },
                },
            ]
        ;

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