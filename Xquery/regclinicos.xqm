module namespace page = 'http://basex.org/examples/web-page';
declare
    %rest:path("getRegistosClinico/2023/10")   
    %rest:GET 
    
    function page:getRegistosClinico() {   
       element  registo {
         for $json in http:send-request(<http:request method='GET'/>, 'http://localhost:3000/api/transfers/report/2023/10')[2]/json/_ 
         return element RegistosClinicos {
           for $transferencia in $json
           return element Transferencia {
             element Destino { $transferencia/Destino },
             element ID_Transferencia { $transferencia/ID_Transferencia },
             element ID_Paciente { $transferencia/ID_Paciente },
             element ID_Profissional { $transferencia/ID_Profissional },
             element Data_Transferencia { $transferencia/Data_Transferencia },
             element Motivo { $transferencia/Motivo },
             element Tipo_Transferencia { $transferencia/Tipo_Transferencia },
             for $relatorio in $transferencia/Relatório
             return element Relatório {
               for $diagnostico in $relatorio/Diagnosticos_Previos
               return element Diagnostico_Previo {
                 element Tipo_Diagnostico { $diagnostico/Tipo_Diagnostico },
                 element Codigo_CID10 { $diagnostico/Codigo_CID10 },
                 element Descricao_Diagnostico { $diagnostico/Descricao_Diagnostico }
               },
               for $tratamento in $relatorio/Tratamentos_Previos
               return element Tratamento_Previo {
                 element ID_Tratamento { $tratamento/ID_Tratamento },
                 element Tipo_Tratamento { $tratamento/Tipo_Tratamento },
                 element Realizado { $tratamento/Realizado }
               }
             }
           }
         }
       }
    };