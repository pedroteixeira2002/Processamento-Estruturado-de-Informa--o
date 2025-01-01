const mongoose = require('mongoose');

const clinicalRecordSchema = new mongoose.Schema({
    ID_Paciente: Number,
    Data_Atendimento: Date,
    Tipo_Diagnostico: String,
    Descricao_Diagnostico: String,
});

module.exports = mongoose.model('clinical_record', clinicalRecordSchema);
