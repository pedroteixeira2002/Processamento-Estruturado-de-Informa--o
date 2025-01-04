module namespace page = 'http://basex.org/examples/web-page';

declare
    %rest:path("transferencia/2023/11")   
    %rest:GET 
    function page:getRegistosClinico(){
      element registos{
      for $json in http:send-request(<http:request method='GET'/>, 'http://localhost:3000/api/transfers/report/2023/11')[2]/json[@type="array"]/_[@type="object"]
        return element transfersByHospital{ 
          element Destino{ $json/Destino/text() },
          element Hospital_Destino{ $json/Hospital__Destino/text() },
          element ID_Paciente{ $json/ID__Paciente/text() },
          element Data_Transferencia{ $json/Data__Transferencia/text() },
          element Motivo{ $json/Motivo/text() },
          element Tipo_Transferencia{ $json/Tipo__Transferencia/text() },
          element Diagnosticos_Previos{ 
            for $diagnostico in $json/Diagnosticos_Previos
            return element result{
              element Tipo_Diagnostico{ $diagnostico/Tipo__Diagnostico/text() },
              element Codigo_CID10{ $diagnostico/Codigo__CID10/text() },
              element Descricao_Diagnostico{ $diagnostico/Descricao__Diagnostico/text() }
            }
          },
          element Tratamentos_Previos{ 
          for $tratamentos in $json/Tratamentos_Previos
            return element result{
              element Tipo_Diagnostico{ $tratamentos/Tipo__Diagnostico/text() },
              element Codigo_CID10{ $tratamentos/Codigo__CID10/text() },
              element Descricao_Diagnostico{ $tratamentos/Descricao__Diagnostico/text() }
            }
          }
        }
      }
    };