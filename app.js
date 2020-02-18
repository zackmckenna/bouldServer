const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const climbsRouter = require('./controllers/climbs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

console.log(config)
console.log(config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connection to MongoDB:', error.message)
  })

app.use(cors())
// app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/climbs', climbsRouter)
// app.use('/api/notes', climbsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
