require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const clinicalRoutes = require('./routes/ClinicalRecordRoute');
const transferRoutes = require('./routes/TransferRoute');

const app = express();

app.use(bodyParser.json());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Servidor na porta 3000');
});

app.use('/api/clinical', clinicalRoutes);
app.use('/api/transfers', transferRoutes);

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message });
});

module.exports = app;
