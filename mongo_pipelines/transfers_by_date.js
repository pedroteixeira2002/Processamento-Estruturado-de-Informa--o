[
    {
        $lookup: {
            from: "clinical_record",
            localField: "ID_Paciente",
            foreignField: "ID_Paciente",
            as: "clinical_records"
        }
    },
    {
        $unwind: "$clinical_records"
    },
    {
        $match: {
            $expr: {
                $lt: [
                    "$clinical_records.Data_Atendimento",
                    "$Data_Transferencia"
                ]
            }
        }
    },
    {
        $lookup: {
            from: "treatment",
            localField:
                "clinical_records.ID_Atendimento",
            foreignField: "ID_Registro_Clinico",
            as: "treatments"
        }
    },
    {
        $unwind: {
            path: "$treatments",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $match: {
            $expr: {
                $or: [
                    {
                        $lt: [
                            "$treatments.Data_Tratamento",
                            "$Data_Transferencia"
                        ]
                    },
                    {
                        $eq: ["$treatments", null]
                    }
                ]
            }
        }
    },
    {
        $limit: 100000
    },
    {
        $group: {
            _id: "$_id",
            Destino: {
                $first: "$Destino"
            },
            ID_Transferencia: {
                $first: "$ID_Transferencia"
            },
            ID_Paciente: {
                $first: "$ID_Paciente"
            },
            ID_Profissional: {
                $first: "$ID_Profissional"
            },
            Data_Transferencia: {
                $first: "$Data_Transferencia"
            },
            Motivo: {
                $first: "$Motivo"
            },
            Tipo_Transferencia: {
                $first: "$Tipo_Transferencia"
            },
            Diagnosticos_Previos: {
                $addToSet: {
                    Tipo_Diagnostico:
                        "$clinical_records.Tipo_Diagnostico",
                    Codigo_CID10:
                        "$clinical_records.Codigo_CID10",
                    Descricao_Diagnostico:
                        "$clinical_records.Descricao_Diagnostico"
                }
            },
            Tratamentos_Previos: {
                $addToSet: {
                    ID_Tratamento:
                        "$treatments.ID_Tratamento",
                    Tipo_Tratamento:
                        "$treatments.Tipo_Tratamento",
                    Realizado: "$treatments.Realizado"
                }
            }
        }
    },
    {
        $addFields: {
            Ano_Transferencia: {
                $year: "$Data_Transferencia"
            },
            Mes_Transferencia: {
                $month: "$Data_Transferencia"
            }
        }
    },
    {
        $group: {
            _id: {
                Ano: "$Ano_Transferencia",
                Mes: "$Mes_Transferencia"
            },
            Meses: {
                $push: {
                    Destino: "$Destino",
                    ID_Transferencia: "$ID_Transferencia",
                    ID_Paciente: "$ID_Paciente",
                    ID_Profissional: "$ID_Profissional",
                    Data_Transferencia:
                        "$Data_Transferencia",
                    Motivo: "$Motivo",
                    Tipo_Transferencia:
                        "$Tipo_Transferencia",
                    Diagnosticos_Previos:
                        "$Diagnosticos_Previos",
                    Tratamentos_Previos:
                        "$Tratamentos_Previos"
                }
            }
        }
    },
    {
        $group: {
            _id: "$_id.Ano",
            Meses: {
                $push: {
                    Mes: "$_id.Mes",
                    Detalhes: "$Meses"
                }
            }
        }
    },
    {
        $sort: {
            _id: 1
        }
    },
    {
        $project: {
            Ano: "$_id",
            Meses: 1
        }
    },
    {
        $merge: {
            into: "transfers_by_date",
            whenMatched: "replace",
            whenNotMatched: "insert"
        }
    }
]