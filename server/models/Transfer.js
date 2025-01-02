const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
    Destino: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destino",
    },
    ID_Paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ID_Paciente",
    },
    ID_Profissional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ID_Profissional",
    },
    ID_Transferencia: {
        ref: "ID_Transferencia",
        type: mongoose.Schema.Types.ObjectId,
    },
    Data_Transferencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data_Transferencia',
    },
    Motivo: {
        ref: "Motivo",
        type: mongoose.Schema.Types.ObjectId,
    },
    Tipo_Transferencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tipo_Transferencia",},
    Diagnosticos_Previos: [
        {
            Tipo_Diagnostico: {
                ref: "Tipo_Diagnostico",
                type: mongoose.Schema.Types.ObjectId,
            },
            Codigo_CID10: {
                ref: "Codigo_CID10",
                type: mongoose.Schema.Types.ObjectId,
            },
            Descricao_Diagnostico: {
                ref: "Descricao_Diagnostico",
                type: mongoose.Schema.Types.ObjectId,
            },
        },
    ],
    Tratamentos_Previos: [
        {
            ID_Tratamento: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ID_Tratamento",
            },
            Tipo_Tratamento: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tipo_Tratamento",
            },
            Realizado: {
                ref:"Realizado",
                type: mongoose.Schema.Types.ObjectId,
            },
        },
    ],
});

module.exports = mongoose.model('transfers_new', transferSchema);
