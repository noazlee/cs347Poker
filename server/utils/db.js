const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://noahzlee7:BuA8hAJGSAm8mbsv@cluster0.jxe1laa.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDb() {
    if (!client.isConnected()) {
        await client.connect();
    }
    return client.db(); // returns the database instance
}

module.exports = { connectDb };
