const connectToDb = require('../db');

exports.getTransferReportByMonth = async (req, res) => {
    const {year, month} = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    try {
        const db = await connectToDb();
        const transfersCollection = db.collection('transfers_new');

        const pipeline = [
            {
                $match: {
                    Data_Transferencia: { $gte: startDate, $lte: endDate },
                },
            },
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
                    totalTransfersByHospital: { $sum: 1 },
                    transfersByMotivo: { $push: "$Motivo" },
                    transfersByTipo: { $push: "$Tipo_Transferencia" },
                },
            },
            {
                $group: {
                    _id: null,
                    transfersByHospital: { $push: "$$ROOT" },
                    totalTransfers: { $sum: "$totalTransfersByHospital" },
                    totalByMotivo: {
                        $push: { motivo: "$transfersByMotivo", count: { $size: "$transfersByMotivo" } },
                    },
                    totalByTipo: {
                        $push: { tipo: "$transfersByTipo", count: { $size: "$transfersByTipo" } },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    transfersByHospital: 1,
                    totalTransfers: 1,
                    totalByMotivo: 1,
                    totalByTipo: 1,
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
