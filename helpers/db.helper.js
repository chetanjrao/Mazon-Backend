const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017", { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    keepAlive: true,
   // useUnifiedTopology: true,
    socketTimeoutMS: 60000,
    connectTimeoutMS: 600000,
    dbName: "db_mazon",
    // authSource: "admin",
    // auth: {
    //     user: "chethanjkulkarni",
    //     password: "Chethanwins@2025"
    // }
})
const ResourceConnection = mongoose.connection

module.exports = {
    resources: ResourceConnection,
}