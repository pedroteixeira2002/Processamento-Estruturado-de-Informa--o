const connectToDb = require('../db');

exports.getTransferReportByMonth = async (req, res) => {
    const {year, month} = req.query;

    if (!year || !month) {
        return res.status(400).json({success: false, message: "Year and month are required."});
    }

    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    try {
        const db = await connectToDb();
        const transfersCollection = db.collection('transfers_by_date');

        const pipeline = [
            {$match: {_id: yearInt, "Meses.Mes": monthInt}},
            {$unwind: "$Meses"},
            {$match: {"Meses.Mes": monthInt}},
            {$unwind: "$Meses.Detalhes"},
            {$group: {
                    _id: null,
                    totalTransferencias: {$sum: 1},
                    transferencias: {$push: "$Meses.Detalhes"}}},
            {$unwind: "$transferencias"},
            {$group: {
                    _id: null,
                    totalTransferencias: {$first: "$totalTransferencias"},
                    transferencias: {$push: "$transferencias"},
                    transferenciasPorMotivo: {$addToSet: "$transferencias.Motivo"},
                    transferenciasPorTipo: {$addToSet: "$transferencias.Tipo_Transferencia"}}},
            {$project: {
                    _id: 0,
                    totalTransferencias: 1,
                    transferencias: 1,
                    porMotivo: {
                        $map: {
                            input: "$transferenciasPorMotivo", as: "motivo", in: {
                                motivo: "$$motivo",
                                totalPorMotivo: {
                                    $size: {
                                        $filter: {
                                            input: "$transferencias",
                                            as: "transferencia",
                                            cond: {$eq: ["$$transferencia.Motivo", "$$motivo"]}}}}}}},
                    porTipo: {
                        $map: {
                            input: "$transferenciasPorTipo",
                            as: "tipo",
                            in: {
                                tipo: "$$tipo",
                                totalPorTipo: {
                                    $size: {
                                        $filter: {
                                            input: "$transferencias",
                                            as: "transferencia",
                                            cond: {$eq: ["$$transferencia.Tipo_Transferencia", "$$tipo"]}}}}}}}}}
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
