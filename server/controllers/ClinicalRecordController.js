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

        const pipeline = [
            { $unwind: "$Meses" },
            { $unwind: "$Meses.Registos" },

            {
                $match: {
                    "Meses.Mes": parseInt(monthInt),
                    "Meses.Registos.Data_Atendimento": { yearInt }
                }
            },

            {
                $project: {
                    "ID_Paciente": "$Meses.Registos.ID_Paciente",
                    "Género": "$Meses.Pacientes.Género",
                    "Data_Nascimento": "$Meses.Pacientes.Data_Nascimento",
                    "Data_Atendimento": "$Meses.Registos.Data_Atendimento"
                }
            },

            {
                $project: {
                    "ID_Paciente": 1,
                    "Género": 1,
                    "Faixa_Etaria": {
                        $switch: {
                            branches: [
                                {
                                    case: { $lte: [{ $subtract: [{ $year: "$Meses.Registos.Data_Atendimento" }, { $year: "$Meses.Pacientes.Data_Nascimento" }] }, 18] },
                                    then: "0-18"
                                },
                                {
                                    case: { $lte: [{ $subtract: [{ $year: "$Meses.Registos.Data_Atendimento" }, { $year: "$Meses.Pacientes.Data_Nascimento" }] }, 45] },
                                    then: "19-45"
                                },
                                {
                                    case: { $gt: [{ $subtract: [{ $year: "$Meses.Registos.Data_Atendimento" }, { $year: "$Meses.Pacientes.Data_Nascimento" }] }, 45] },
                                    then: "46+"
                                }
                            ],
                            default: "Desconhecido"
                        }
                    }
                }
            },

            {
                $group: {
                    _id: {
                        faixaEtaria: "$Faixa_Etaria",
                        genero: "$Género"
                    },
                    totalPacientes: { $sum: 1 }
                }
            },

            {
                $facet: {
                    faixaEtaria: [
                        {
                            $match: { "_id.faixaEtaria": { $ne: "Desconhecido" } }
                        },
                        {
                            $project: {
                                _id: 0,
                                faixaEtaria: "$_id.faixaEtaria",
                                totalPacientes: 1
                            }
                        }
                    ],
                    genero: [
                        {
                            $match: { "_id.genero": { $ne: "Desconhecido" } }
                        },
                        {
                            $project: {
                                _id: 0,
                                genero: "$_id.genero",
                                totalPacientes: 1
                            }
                        }
                    ]
                }
            }
        ];




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