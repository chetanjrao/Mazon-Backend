const mongoose = require('mongoose')
const ResourceConnection = mongoose.createConnection("mongodb://localhost:27017/Mazon", { useNewUrlParser: true, useCreateIndex: true })

module.exports = {
    resources: ResourceConnection,
}