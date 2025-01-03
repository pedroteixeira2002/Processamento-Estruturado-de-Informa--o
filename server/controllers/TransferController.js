const connectToDb = require('../db');

exports.getTransferReportByMonth = async (req, res) => {
    const {year, month} = req.query;

    if (!year || !month) {
        return res.status(400).json({success: false, message: "Year and month are required."});
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    try {
        const db = await connectToDb();
        const transfersCollection = db.collection('transfers_new');

        const pipeline = [
            {
                $match: {
                    Data_Transferencia: {$gte: startDate, $lte: endDate},
                },
            },
            {
                $facet: {
                    transfersByHospital: [
                        {
                            $group: {
                                _id: "$Hospital_Destino",
                                transfers: {
                                    $push: {
                                        Hospital_Destino: "$Hospital_Destino",
                                        Destino: "$Destino",
                                        ID_Paciente: "$ID_Paciente",
                                        Data_Transferencia: "$Data_Transferencia",
                                        Motivo: "$Motivo",
                                        Tipo_Transferencia: "$Tipo_Transferencia",
                                        Diagnosticos_Previos: "$Diagnosticos_Previos",
                                        Tratamentos_Previos: "$Tratamentos_Previos",
                                    },
                                },
                                totalTransfersByHospital: {$sum: 1},
                            },
                        },
                        {$sort: {"_id": 1}},
                    ],
                    totalTransfers: [
                        {
                            $count: "totalTransfers",
                        },
                    ],
                    totalByMotivo: [
                        {
                            $group: {
                                _id: "$Motivo",
                                count: {$sum: 1},
                            },
                        },
                    ],
                    totalByTipo: [
                        {
                            $group: {
                                _id: "$Tipo_Transferencia",
                                count: {$sum: 1},
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    transfersByHospital: 1,
                    totalTransfers: {$arrayElemAt: ["$totalTransfers.totalTransfers", 0]},
                    totalByMotivo: {
                        $arrayToObject: {
                            $map: {
                                input: "$totalByMotivo",
                                as: "motivo",
                                in: {k: "$$motivo._id", v: "$$motivo.count"},
                            },
                        },
                    },
                    totalByTipo: {
                        $arrayToObject: {
                            $map: {
                                input: "$totalByTipo",
                                as: "tipo",
                                in: {k: "$$tipo._id", v: "$$tipo.count"},
                            },
                        },
                    },
                },
            },
        ];

        const result = await transfersCollection.aggregate(pipeline).toArray();

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
