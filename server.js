const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

const dbConf = require('./config/db.config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

mongoose.connect(dbConf.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log(`Succ connection to db`)
}).catch(err => {
    console.log(`Could not connect to db ${err}`)
    process.exit()
})

app.get('/', (req, res) => {
    res.json({"message": "Welcome to app."})
})

require('./app/routes/note.routes')(app)

app.listen(3000, () => {
    console.log(`Server is listening on port 3k`)
})