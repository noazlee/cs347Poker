const { MongoClient } = require('mongodb');

let db = null;
const url = 'mongodb+srv://noahzlee7:HMhJ1jzf80jZdGvd@cluster0.jxe1laa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'PokerApp';
async function connectDb() {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    if (db) {
        return db;
    }

    await client.connect();
    db = client.db(dbName);
    return db;
}

module.exports = { connectDb };