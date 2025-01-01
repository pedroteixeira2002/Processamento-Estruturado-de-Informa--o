const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    ID_Transferencia: Number,
    ID_Paciente: Number,
    Data_Transferencia: Date,
    Motivo: String,
});

module.exports = mongoose.model('transfer', transferSchema);