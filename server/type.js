{
    "_id": 2022,
    "Meses": [
    {
        "Mes": 12,
        "Registos": [
            {
                "ID_Registo_Clinico": 355,
                "ID_Paciente": 10469,
                "ID_Profissional": 47,
                "Data_Atendimento": {
                    "$date": "2022-12-24T00:00:00.000Z"
                },
                "Diagnosticos": [
                    {
                        "Tipo_Diagnostico": "Principal",
                        "Codigo_CID10": "A09",
                        "Descricao_Diagnostico": "Diarreia e gastroenterite de origem infecciosa presumível"
                    },
                    {
                        "Tipo_Diagnostico": "Secundario",
                        "Codigo_CID10": "O80",
                        "Descricao_Diagnostico": "Parto único espontâneo"
                    },
                    {
                        "Tipo_Diagnostico": "Secundario",
                        "Codigo_CID10": "K29",
                        "Descricao_Diagnostico": "Gastrite e duodenite"
                    }
                ],
                "Tratamentos": [
                    {
                        "_id": {
                            "$oid": "676724324bf1a1b510be62a4"
                        },
                        "ID_Tratamento": 60028,
                        "ID_Registro_Clinico": 355,
                        "Tipo_Tratamento": "Teste de glicemia",
                        "Realizado": "Sim"
                    },
                    {
                        "_id": {
                            "$oid": "676724594bf1a1b510c1ce1f"
                        },
                        "ID_Tratamento": 284150,
                        "ID_Registro_Clinico": 355,
                        "Tipo_Tratamento": "Salbutamol inalatório",
                        "Realizado": "Sim"
                    }
                ]
            }
        ],
        "Pacientes": [
            {
                "_id": {
                    "$oid": "676723554bf1a1b510bcd668"
                },
                "ID_Paciente": 803,
                "Nome_Completo": "Sean Moore",
                "Data_Nascimento": {
                    "$date": "1977-03-07T00:00:00.000Z"
                },
                "Género": "F",
                "Email": "desconhecido",
                "Data_Registo": {
                    "$date": "2012-07-29T00:00:00.000Z"
                }
            }
        ]
    }
],
    "Ano": 2022
}