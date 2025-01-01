require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const clinicalRoutes = require('./routes/ClinicalRecordRoute');
const transferRoutes = require('./routes/TransferRoute');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Servidor na porta 3000!');
});

app.use('/api/clinical-reports', clinicalRoutes);
app.use('/api/transfer-reports', transferRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongo conectado'))
    .catch((err) => console.error('Erro ao conectar ao Mongo: ', err));


module.exports = app;
