const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = "mongodb+srv://root:" + process.env.MONGODB_PASSWORD + "@gralka.a25np.mongodb.net/Minecraft?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = client.db("Minecraft");

// Async function + connect to database + create document
async function createDocument(collection, document) {
    try {
        await client.connect();
        const result = await db.collection(collection).insertOne(document);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

function findNewest(collection, document) {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                reject(err);
            }
            db.collection(collection).find(document).sort({ _id: -1 }).limit(1).toArray((err, result) => {
                if (err) {
                    reject(err);
                }   
                resolve(result);
            });
        });
    });
}

async function deleteNewest(collection) {
    try {
        await client.connect();
        const result = await db.collection(collection).find().sort({ _id: -1 }).limit(1).toArray();
        const result2 = await db.collection(collection).deleteOne({ _id: result[0]._id });
        return result2;
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}


async function deleteDocument(collection, document) {
    try {
        await client.connect();
        const result = await db.collection(collection).deleteOne(document);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

// Make accessible to other files
module.exports = {
    createDocument, findNewest, deleteNewest, deleteDocument
};