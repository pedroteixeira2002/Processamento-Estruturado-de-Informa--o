#!/usr/bin/env node

const http = require('http');
const app = require('./app'); // Importa o app.js

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

const server = http.createServer(app);

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} já está em uso.`);
        process.exit(1);
    } else {
        throw error;
    }
});

server.listen(PORT, () => {
    console.log(`Servido na porta ${PORT}`);
});
