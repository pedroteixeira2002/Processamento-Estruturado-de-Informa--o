module namespace page = 'http://basex.org/examples/web-page';

declare
    %rest:path("transferencia/{$year}/{$month}")         
    function page:getTransferReport($year as xs:string?, $month as xs:string?) {
        let $default-year := "2024"
        let $default-month := "10"
        let $actual-year := if ($year) then $year else $default-year
        let $actual-month := if ($month) then $month else $default-month
        let $url := concat("http://localhost:3000/api/transfers/report?year=", $actual-year, "&amp;month=", $actual-month)
        let $response := http:send-request(
            <http:request method="GET" href="{$url}"/>
        )
        let $json := $response//json[1]
        let $xml := 
            element transferReport {
                element totalTransferencias { $json/data/_/totalTransferencias/text() },
                element transferencias {
                    for $transfer in $json/data/_/transferencias/_
                    return element transferencia {
                        element Destino { $transfer/Destino/text() },
                        element Hospital_Destino { $transfer/Hospital__Destino/text() },
                        element ID_Paciente { $transfer/ID__Paciente/text() },
                        element Data_Transferencia { 
                            substring-before($transfer/Data__Transferencia/text(), "T") 
                        },
                        element Motivo { $transfer/Motivo/text() },
                        element Tipo_Transferencia { $transfer/Tipo__Transferencia/text() },
                        element Diagnosticos_Previos {
                            for $diagnostico in $transfer/Diagnosticos__Previos/_
                            return element diagnostico {
                                element Tipo_Diagnostico { $diagnostico/Tipo__Diagnostico/text() },
                                element Codigo_CID10 { $diagnostico/Codigo__CID10/text() },
                                element Descricao_Diagnostico { $diagnostico/Descricao__Diagnostico/text() }
                            }
                        },
                        element Tratamentos_Previos {
                            for $tratamento in $transfer/Tratamentos__Previos/_
                            return element tratamento {
                                element Tipo_Diagnostico { $tratamento/ID__Tratamento/text() },
                                element Codigo_CID10 { $tratamento/Tipo__Tratamento/text() },
                                element Descricao_Diagnostico { $tratamento/Realizado/text() }
                            }
                        }
                    }
                },
                element porMotivo {
                    for $motivo in $json/data/_/porMotivo/_
                    return element motivo {
                        element descricao { $motivo/motivo/text() },
                        element total { $motivo/totalPorMotivo/text() }
                    }
                },
                element porTipo {
                    for $tipo in $json/data/_/porTipo/_
                    return element tipo {
                        element descricao { $tipo/tipo/text() },
                        element total { $tipo/totalPorTipo/text() }
                    }
                }
            }
        let $validated-xml := validate:xsd($xml, "transferReport.xsd")
        return (
            file:write(concat("transferReport_", $actual-year, "_", $actual-month, ".xml"), $validated-xml),
            $validated-xml
        )
    };
