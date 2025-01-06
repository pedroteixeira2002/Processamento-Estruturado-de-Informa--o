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
                element ID_Registo_Clinico { $registro/ID__Registo__Clinico/text() },
                element ID_Paciente { $registro/ID__Paciente/text() },
                element ID_Profissional { $registro/ID__Profissional/text() },
                element Data_Atendimento { substring-before($registro/Data__Atendimento, "T") },
                element Diagnosticos {
                    for $diagnostico in $registro/Diagnosticos/_ 
                    return element Diagnostico {
                        element Tipo_Diagnostico { $diagnostico/Tipo__Diagnostico/text() },
                        element Codigo_CID10 { $diagnostico/Codigo__CID10/text() },
                        element Descricao_Diagnostico { $diagnostico/Descricao__Diagnostico/text() }
                    }
                },
                
                element Tratamentos {
    if (count($registro/Tratamentos/_) > 0) then
        for $tratamento in $registro/Tratamentos/_ 
        return element Tratamento {
            element ID_Tratamento { $tratamento/ID__Tratamento/text() },
            element Tipo_Tratamento { $tratamento/Tipo__Tratamento/text() },
            element Realizado { $tratamento/Realizado/text() }
        }
    else
        element Tratamento {
            element ID_Tratamento { "N/A" },
            element Tipo_Tratamento { "N/A" },
            element Realizado { "N/A" }
        }
}
            },
            element Pacientes {
                for $paciente in $json/data/_/Pacientes/_ 
                return element Paciente {
                    element ID__Paciente { $paciente/ID__Paciente/text() },
                    element Nome__Completo { $paciente/Nome__Completo/text() },
                    element Data__Nascimento { substring-before($paciente/Data__Nascimento, "T") },
                    element Genero { $paciente/Género/text() },
                    element Email { $paciente/Email/text() },
                    element Data_Registo { substring-before($paciente/Data__Registo, "T") }
                }
            },
            element Estatisticas {
                element FaixaEtaria {
                    element Faixa {
                        element FaixaEtaria { "0-18" },
                        element TotalPacientes { $json/data/_/estatisticas/faixaEtaria/_0030-18/text() }
                    },
                    element Faixa {
                        element FaixaEtaria { "19-65" },
                        element TotalPacientes { $json/data/_/estatisticas/faixaEtaria/_00319-65/text() }
                    },
                    element Faixa {
                        element FaixaEtaria { "65+" },
                        element TotalPacientes { $json/data/_/estatisticas/faixaEtaria/_00365_002b/text()}
                    }
                },
                element PorGenero {
                    element Genero {
                        element Genero { "M" },
                        element TotalPacientes { $json/data/_/estatisticas/porGenero/M/text() }
                    },
                    element Genero {
                        element Genero { "F" },
                        element TotalPacientes { $json/data/_/estatisticas/porGenero/F/text() }
                    }
                },
                element TotalTratamentos { $json/data/_/estatisticas/totalTratamentos/text() }
            }
        }

        let $validated-xml := validate:xsd($xml, "RegistosClinicos.xsd")
        return (
            file:write(concat("clinicalReport_", $actual-year, "_", $actual-month, ".xml"), $validated-xml),
            $validated-xml
        )
    };
