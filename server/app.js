const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const clinicalRoutes = require('./routes/ClinicalRecordRoute');
const transferRoutes = require('./routes/TransferRoute');

const app = express();

app.use(bodyParser.json());

app.use('/api/clinical-reports', clinicalRoutes);
app.use('/api/transfer-reports', transferRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo conectado'))
    .catch((err) => console.error('Erro ao conectar ao Mongo: ', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
});
