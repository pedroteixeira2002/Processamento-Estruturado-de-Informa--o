module namespace page = 'http://basex.org/examples/web-page';

declare
    %rest:path("getRegistosClinico/{$year}/{$month}")       
    function page:getTransferReport($year as xs:string?, $month as xs:string?) {
        let $default-year := "2024"
        let $default-month := "10"
        let $actual-year := if ($year) then $year else $default-year
        let $actual-month := if ($month) then $month else $default-month
        let $url := concat("http://localhost:3000/api/clinical/report?year=", $actual-year, "&amp;month=", $actual-month)
        let $response := http:send-request(
            <http:request method="GET" href="{$url}"/>
        )
      let $json := $response//json[1]



        let $xml := element RegistosClinicos {
            for $registro in $json/data/_/Registos/_ 
            return element RegistoClinico {
                element ID_Registo_Clinico { $registro/ID__Registo__Clinico },
                element ID_Paciente { $registro/ID__Paciente },
                element ID_Profissional { $registro/ID__Profissional },
                element Data_Atendimento { $registro/Data__Atendimento },
                element Diagnosticos {
                    for $diagnostico in $registro/Diagnosticos/_ 
                    return element Diagnostico {
                        element Tipo_Diagnostico { $diagnostico/Tipo__Diagnostico },
                        element Codigo_CID10 { $diagnostico/Codigo__CID10 },
                        element Descricao_Diagnostico { $diagnostico/Descricao__Diagnostico }
                    }
                },
                element Tratamentos {
                    for $tratamento in $registro/Tratamentos/_ 
                    return element Tratamento {
                        element ID_Tratamento { $tratamento/ID__Tratamento },
                        element Tipo_Tratamento { $tratamento/Tipo__Tratamento },
                        element Realizado { $tratamento/Realizado }
                    }
                }
            },
            element Pacientes {
                for $paciente in $json/data/_/Pacientes/_ 
                return element Paciente {
                    element ID__Paciente { $paciente/ID__Paciente },
                    element Nome__Completo { $paciente/Nome__Completo/text() },
                    element Data__Nascimento { $paciente/Data__Nascimento/text() },
                    element Genero { $paciente/Género/text() },
                    element Email { $paciente/Email/text() },
                    element Data_Registo { $paciente/Data__Registo/text() }
                }
            },
            element Estatisticas {
                element FaixaEtaria {
                    element Faixa {
                        element FaixaEtaria { "0-18" },
                        element TotalPacientes { $json/data/_/estatisticas/faixaEtaria/`0-18` }
                    },
                    element Faixa {
                        element FaixaEtaria { "19-65" },
                        element TotalPacientes { $json/data/_/estatisticas/faixaEtaria/`19-65` }
                    },
                    element Faixa {
                        element FaixaEtaria { "65+" },
                        element TotalPacientes { $json/data/_/estatisticas/faixaEtaria/`65+` }
                    }
                },
                element PorGenero {
                    element Genero {
                        element Genero { "M" },
                        element TotalPacientes { $json/data/_/estatisticas/porGenero/M }
                    },
                    element Genero {
                        element Genero { "F" },
                        element TotalPacientes { $json/data/_/estatisticas/porGenero/F }
                    }
                },
                element TotalTratamentos { $json/data/_/estatisticas/totalTratamentos }
            }
        }
              return (
        file:write(concat("clinicalReport_", $year, "_", $month, ".xml"), $xml),
        $xml 
      ) 
    };
