module namespace page = 'http://basex.org/examples/web-page';

declare
    %rest:path("getRegistosClinico/2023/10")   
    %rest:GET 

    function page:getRegistosClinico() {   
        let $json := http:send-request(
            <http:request method="GET" href="http://localhost:3000/api/transfers/report/2023/10"/>
        )[2]/json/_

        let $xml := element RegistosClinicos {
            for $registro in $json/Registos
            return element RegistoClinico {
                element ID_Registo_Clinico { $registro/ID_Registo_Clinico },
                element ID_Paciente { $registro/ID_Paciente },
                element ID_Profissional { $registro/ID_Profissional },
                element Data_Atendimento { $registro/Data_Atendimento },
                element Diagnosticos {
                    for $diagnostico in $registro/Diagnosticos
                    return element Diagnostico {
                        element Tipo_Diagnostico { $diagnostico/Tipo_Diagnostico },
                        element Codigo_CID10 { $diagnostico/Codigo_CID10 },
                        element Descricao_Diagnostico { $diagnostico/Descricao_Diagnostico }
                    }
                },
                element Tratamentos {
                    for $tratamento in $registro/Tratamentos
                    return element Tratamento {
                        element ID_Tratamento { $tratamento/ID_Tratamento },
                        element Tipo_Tratamento { $tratamento/Tipo_Tratamento },
                        element Realizado { $tratamento/Realizado }
                    }
                }
            },
            element Pacientes {
                for $paciente in $json/Pacientes
                return element Paciente {
                    element ID_Paciente { $paciente/ID_Paciente },
                    element Nome_Completo { $paciente/Nome_Completo },
                    element Data_Nascimento { $paciente/Data_Nascimento },
                    element Género { $paciente/Género },
                    element Email { $paciente/Email },
                    element Data_Registo { $paciente/Data_Registo }
                }
            },
            element Estatisticas {
                element FaixaEtaria {
                        element Faixa {
                        element FaixaEtaria { "0-18" },
                        element TotalPacientes { $json/estatisticas/faixaEtaria/`0-18` }
                         },
                        element Faixa {
                        element FaixaEtaria { "19-65" },
                        element TotalPacientes { $json/estatisticas/faixaEtaria/`19-65` }
                        },
                        element Faixa {
                        element FaixaEtaria { "65+" },
                        element TotalPacientes { $json/estatisticas/faixaEtaria/`65+` }
                        }
                        },
                element PorGenero {
                        element Genero {
                        element Genero { "M" },
                        element TotalPacientes { $json/estatisticas/porGenero/M }
                        },
                        element Genero {
                        element Genero { "F" },
                        element TotalPacientes { $json/estatisticas/porGenero/F }
                        }
                        },
                element PorCronicas {
                    for $condicao in $json/estatisticas/porCronicas
                    return element Cronica {
                        element Condicao { $condicao/condicao },
                        element TotalPacientes { $condicao/totalPacientes }
                    }
                },
                element TotalTratamentos { $json/estatisticas/totalTratamentos }
            }
        }

        return (
            file:write("registosClinicos.xml", $xml),
            $xml
        )
    };
