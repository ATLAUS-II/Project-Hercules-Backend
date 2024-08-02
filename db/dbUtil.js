const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")


let mongoServer


const memoryServerConnect = async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
}

const memoryServerDisconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
}

async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
}


module.exports = {
    memoryServerConnect,
    memoryServerDisconnect,
    clearDatabase
}