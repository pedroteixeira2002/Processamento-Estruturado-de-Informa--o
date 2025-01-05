module namespace page = 'http://basex.org/examples/web-page';

declare
    %rest:path("transferencia/{year}/{month}")   
    %rest:GET 
    function page:getTransferReport($year as xs:string, $month as xs:string) {
      let $url := concat("http://localhost:3000/api/transfers/report?year=", $year, "&amp;month=", $month)
      let $response := http:send-request(<http:request method='GET'/>, $url)
      let $json := json:parse($response/json)
      let $xml := 
        element transferReport {
          element totalTransferencias { $json/data/totalTransferencias/text() },
          element transferencias {
            for $transfer in $json/data/transferencias
            return element transferencia {
              element Destino { $transfer/Destino/text() },
              element Hospital_Destino { $transfer/Hospital__Destino/text() },
              element ID_Paciente { $transfer/ID__Paciente/text() },
              element Data_Transferencia { $transfer/Data__Transferencia/text() },
              element Motivo { $transfer/Motivo/text() },
              element Tipo_Transferencia { $transfer/Tipo__Transferencia/text() },
              element Diagnosticos_Previos {
                for $diagnostico in $transfer/Diagnosticos_Previos
                return element diagnostico {
                  element Tipo_Diagnostico { $diagnostico/Tipo__Diagnostico/text() },
                  element Codigo_CID10 { $diagnostico/Codigo__CID10/text() },
                  element Descricao_Diagnostico { $diagnostico/Descricao__Diagnostico/text() }
                }
              },
              element Tratamentos_Previos {
                for $tratamento in $transfer/Tratamentos_Previos
                return element tratamento {
                  element Tipo_Diagnostico { $tratamento/Tipo__Diagnostico/text() },
                  element Codigo_CID10 { $tratamento/Codigo__CID10/text() },
                  element Descricao_Diagnostico { $tratamento/Descricao__Diagnostico/text() }
                }
              }
            }
          },
          element porMotivo {
            for $motivo in $json/data/porMotivo
            return element motivo {
              element descricao { $motivo/motivo/text() },
              element total { $motivo/totalPorMotivo/text() }
            }
          },
          element porTipo {
            for $tipo in $json/data/porTipo
            return element tipo {
              element descricao { $tipo/tipo/text() },
              element total { $tipo/totalPorTipo/text() }
            }
          }
        }
      return (
        file:write(concat("C:/reports/transferReport_\", $year, "_\", $month, ".xml\"), $xml),
        $xml
      )
    };
