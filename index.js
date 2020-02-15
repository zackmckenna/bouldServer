 const express = require('express')
 const app = express()
 const bodyParser = require('body-parser')

 app.use(bodyParser.json())

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

 const generateId = () => {
  const maxId = climbs.length > 0
  ? Math.max(...climbs.map(n => n.id))
  : 0
  return maxId + 1
 }

 app.post('/climbs', (request, response) => {
  const body = request.body

  if (!body.result | !body.personalDifficulty | !body.setDifficulty) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const climb = {
    personalDifficulty: body.personalDifficulty,
    setDifficulty: body.setDifficulty,
    result: body.result,
    completed: body.completed || false,
    id: generateId(),
    date: new Date(),
    holdsReached: body.holdsReached || 0
  }

  climbs = climbs.concat(climb)

  response.json(climb)
 })

 app.get('/', (request, response) => {
   response.send('<h1>hello world</h1>')
 })

 app.get('/climbs', (request, response) => {
   response.json(climbs)
 })

 app.get('/climbs/:id', (request, response) => {
   const id = Number(request.params.id)
   const climb = climbs.find(climb => climb.id === id)
   if (climb) {
     response.json(climb)
   } else {
     response.status(404).end()
   }
 })

 app.delete('/climbs/:id', (request, response) => {
  const id = Number(request.params.id)
  climbs = climbs.filter(climb => climb.id !== id )

  response.status(204).end()
 })

 const PORT = 3001
 app.listen(PORT, () => {
   console.log(`server running on port ${PORT}`)
 })
