const Transfer = require("../models/Transfer");

getTransferReportByMonth = async (req, res) => {
    try {
        const {year, month} = req.params;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // End of the month

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const pipeline = [
            {
                $match: {
                    Data_Transferencia: {$gte: startDate, $lte: endDate},
                },
            },
            {
                $group: {
                    _id: "$Destino",
                    transfers: {
                        $push: {
                            ID_Paciente: "$ID_Paciente",
                            Data_Transferencia: "$Data_Transferencia",
                            Motivo: "$Motivo",
                            Tipo_Transferencia: "$Tipo_Transferencia",
                            Diagnosticos_Previos: "$Diagnosticos_Previos",
                            Tratamentos_Previos: "$Tratamentos_Previos",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    transfers: 1,
                },
            },
        ];

        const transfers = await Transfer.aggregate(pipeline);

        // Handle no results
        if (!transfers || transfers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transfers found for the specified period.",
            });
        }

        return res.status(200).json({success: true, data: transfers});
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
};

module.exports = {getTransferReportByMonth};
