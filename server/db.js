const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://pedro:pedro@medsync.vziha.mongodb.net/?retryWrites=true&w=majority&appName=MedSync';
const dbName = 'data';
let db;

async function connectToDb() {
    if (!db) {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    }
    return db;
}

module.exports = connectToDb;
