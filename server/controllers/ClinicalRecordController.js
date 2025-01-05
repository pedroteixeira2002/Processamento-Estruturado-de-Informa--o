const connectToDb = require('../db');


exports.getClinicalReportByMonth = async (req, res) => {
    const {year, month} = req.query;

    if (!year || !month) {
        return res.status(400).json({success: false, message: "Year and month are required."});
    }

    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    try {
        const db = await connectToDb();
        const recordsCollection = db.collection('records_by_date');

        const pipeline = [
            {
                $match: {
                    _id: yearInt,
                    "Meses.Mes": monthInt
                }
            },
            {
                $unwind: "$Meses"
            },
            {
                $match: {
                    "Meses.Mes": monthInt
                }
            },
            {
                $addFields: {
                    estatisticas: {
                        faixaEtaria: {
                            $reduce: {
                                input: "$Meses.Pacientes",
                                initialValue: {
                                    "0-18": 0,
                                    "19-65": 0,
                                    "65+": 0
                                },
                                in: {
                                    $mergeObjects: [
                                        "$$value",
                                        {
                                            $cond: [
                                                {
                                                    $lte: [
                                                        {
                                                            $subtract: [
                                                                yearInt,
                                                                {
                                                                    $year:
                                                                        "$$this.Data_Nascimento"
                                                                }
                                                            ]
                                                        },
                                                        18
                                                    ]
                                                },
                                                {
                                                    "0-18": {
                                                        $add: ["$$value.0-18", 1]
                                                    }
                                                },
                                                {
                                                    $cond: [
                                                        {
                                                            $and: [
                                                                {
                                                                    $gt: [
                                                                        {
                                                                            $subtract: [
                                                                                yearInt,
                                                                                {
                                                                                    $year:
                                                                                        "$$this.Data_Nascimento"
                                                                                }
                                                                            ]
                                                                        },
                                                                        18
                                                                    ]
                                                                },
                                                                {
                                                                    $lte: [
                                                                        {
                                                                            $subtract: [
                                                                                yearInt,
                                                                                {
                                                                                    $year:
                                                                                        "$$this.Data_Nascimento"
                                                                                }
                                                                            ]
                                                                        },
                                                                        65
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "19-65": {
                                                                $add: [
                                                                    "$$value.19-65",
                                                                    1
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            "65+": {
                                                                $add: [
                                                                    "$$value.65+",
                                                                    1
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        porGenero: {
                            $reduce: {
                                input: "$Meses.Pacientes",
                                initialValue: {
                                    M: 0,
                                    F: 0
                                },
                                in: {
                                    $mergeObjects: [
                                        "$$value",
                                        {
                                            $cond: [
                                                {
                                                    $eq: ["$$this.Género", "M"]
                                                },
                                                {
                                                    M: {
                                                        $add: ["$$value.M", 1]
                                                    }
                                                },
                                                {
                                                    $cond: [
                                                        {
                                                            $eq: [
                                                                "$$this.Género",
                                                                "F"
                                                            ]
                                                        },
                                                        {
                                                            F: {
                                                                $add: ["$$value.F", 1]
                                                            }
                                                        },
                                                        "$$value"
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        totalTratamentos: {
                            $reduce: {
                                input: "$Meses.Registos",
                                initialValue: 0,
                                in: {
                                    $add: [
                                        "$$value",
                                        {
                                            $size: "$$this.Tratamentos"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    Ano: "$_id",
                    Mes: "$Meses.Mes",
                    Registos: "$Meses.Registos",
                    Pacientes: "$Meses.Pacientes",
                    estatisticas: "$estatisticas"
                }
            }
        ];

        const result = await recordsCollection.aggregate(pipeline).toArray();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch
        (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the report.',
        });
    }
}
;