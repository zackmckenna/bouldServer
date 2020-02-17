require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Climb = require('./models/climb')

app.use(bodyParser.json())
morgan.token('data', function (request,response) { return JSON.stringify(request.body)})
app.use(morgan(':data'))
app.use(cors())

 let climbs = [
   {
     id: 1,
     personalDifficulty: 1,
     setDifficulty: 2,
     result: 'redpoint'
   },
   {
    id: 2,
    personalDifficulty: 1,
    setDifficulty: 3,
    result: 'flash',
    completed: false
  },
  {
    id: 3,
    personalDifficulty: 3,
    setDifficulty: 4,
    result: 'uncomplete',
    completed: false
  }
 ]

 const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

 const generateId = () => {
  const maxId = climbs.length > 0
  ? Math.max(...climbs.map(n => n.id))
  : 0
  return maxId + 1
 }

 app.get('/info', (request, response) => {
   response.send(`<h1>there are ${climbs.length} climbs in the database</h1><h2>The date is ${new Date()}.</h2>`)
 })

 app.post('/api/climbs', (request, response) => {
  const body = request.body

  if(body.personalDifficulty === undefined || body.setDifficulty === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  if (!body.result | !body.personalDifficulty | !body.setDifficulty) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const climb = new Climb({
    personalDifficulty: body.personalDifficulty,
    setDifficulty: body.setDifficulty,
    result: body.result,
    completed: body.completed || false,
    id: generateId(),
    date: new Date(),
    holdsReached: body.holdsReached || 0
  })

  climb
    .save()
    .then(savedClimb => savedClimb.toJSON())
    .then(savedAndFormattedClimb => {
      response.json(savedAndFormattedClimb)
    })
    .catch(error => next(error))
 })

 app.get('/', (request, response) => {
   response.send('<h1>hello world</h1>')
 })

 app.get('/api/climbs', (request, response) => {
   response.json(climbs).status(204)
 })

 app.get('/api/climbs/:id', (request, response, next) => {
   Climb.findById(request.params.id)
    .then(climb => {
      if (climb) {
        response.json(climb.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
 })

 app.delete('/api/climbs/:id', (request, response, next) => {
  Climb.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
 })

 app.put('/api/climbs/:id', (request, response, next) => {
   const body = request.body

   const climb = {
    personalDifficulty: body.personalDifficulty,
    setDifficulty: body.setDifficulty,
    result: body.result,
    completed: body.completed || false,
    holdsReached: body.holdsReached
   }

   Climb.findByIdAndUpdate(request.params.id, climb, { new: true })
   .then(updatedClimb => {
     response.json(updatedClimb.toJSON())
   })
   .catch(error => next(error))
 })

 const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
 }

 app.use(requestLogger)

 const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
 }

 app.use(unknownEndpoint)

 const PORT = process.env.PORT || 8080
 app.listen(PORT, () => {
   console.log(`server running on port ${PORT}`)
 })
