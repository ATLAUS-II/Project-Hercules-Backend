const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")


let mongoServer


const memoryServerConnect = async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    // console.log("Connected to Mongodb Memory Server")
    await mongoose.connect(uri)
}

const memoryServerDisconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
}


module.exports = {
    memoryServerConnect,
    memoryServerDisconnect
}