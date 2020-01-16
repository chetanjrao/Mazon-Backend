const mongoose = require('mongoose')
const ResourceConnection = mongoose.createConnection(`mongodb://localhost:27017/db_mazon`, { useNewUrlParser: true, 
    useCreateIndex: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
})

module.exports = {
    resources: ResourceConnection,
}