const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = "mongodb+srv://root:" + process.env.MONGODB_PASSWORD + "@gralka.a25np.mongodb.net/Minecraft?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Async function + connect to database + create document
async function createDocument(collection, document) {
    try {
        await client.connect();
        const db = client.db("Minecraft");
        const result = await db.collection(collection).insertOne(document);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

// Make accessible to other files
module.exports = {
    createDocument
};