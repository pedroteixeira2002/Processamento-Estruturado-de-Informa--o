[
    {
        $limit: 1000
    },
    {
        $group: {
            _id: "$ID_Atendimento",
            Diagnosticos: {
                $push: {
                    Tipo_Diagnostico: "$Tipo_Diagnostico",
                    Codigo_CID10: "$Codigo_CID10",
                    Descricao_Diagnostico:
                        "$Descricao_Diagnostico"
                }
            },
            ID_Paciente: {
                $first: "$ID_Paciente"
            },
            ID_Profissional: {
                $first: "$ID_Profissional"
            },
            Data_Atendimento: {
                $first: "$Data_Atendimento"
            }
        }
    },
    {
        $lookup: {
            from: "treatment",
            localField: "_id",
            foreignField: "ID_Registro_Clinico",
            as: "Tratamentos"
        }
    },
    {
        $lookup: {
            from: "treatment_update",
            localField: "_id",
            foreignField: "ID_Registro_Clinico",
            as: "TratamentosAtualizados"
        }
    },
    {
        $addFields: {
            Tratamentos: {
                $concatArrays: [
                    "$Tratamentos",
                    "$TratamentosAtualizados"
                ]
            }
        }
    },
    {
        $addFields: {
            Ano_Atendimento: {
                $year: "$Data_Atendimento"
            },
            Mes_Atendimento: {
                $month: "$Data_Atendimento"
            }
        }
    },
    {
        $project: {
            _id: 0,
            ID_Registo_Clinico: "$_id",
            ID_Paciente: 1,
            ID_Profissional: 1,
            Data_Atendimento: 1,
            Registos: {
                Diagnostico: "$Diagnosticos",
                Tratamento: "$Tratamentos"
            },
            Ano_Atendimento: 1,
            Mes_Atendimento: 1
        }
    },
    {
        $limit: 1000
    },
    {
        $group: {
            _id: {
                Ano: "$Ano_Atendimento",
                Mes: "$Mes_Atendimento"
            },
            Registos: {
                $push: {
                    ID_Registo_Clinico:
                        "$ID_Registo_Clinico",
                    ID_Paciente: "$ID_Paciente",
                    ID_Profissional: "$ID_Profissional",
                    Data_Atendimento: "$Data_Atendimento",
                    Diagnosticos: "$Registos.Diagnostico",
                    Tratamentos: "$Registos.Tratamento"
                }
            },
            Pacientes: {
                $addToSet: "$ID_Paciente"
            }
        }
    },
    {
        $lookup: {
            from: "pacient",
            localField: "Pacientes",
            foreignField: "ID_Paciente",
            as: "PacientesDetalhados"
        }
    },
    {
        $group: {
            _id: "$_id.Ano",
            Meses: {
                $push: {
                    Mes: "$_id.Mes",
                    Registos: "$Registos",
                    Pacientes: {
                        $setUnion: [
                            "$PacientesDetalhados",
                            []
                        ]
                    }
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
        $out: "records_by_date"
    }
]