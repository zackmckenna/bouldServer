const climbsRouter = require('express').Router()
const Climb = require('../models/climb')

climbsRouter.get('/', async (request, response) => {
  const climbs = await Climb.find({})
  response.json(climbs.map(climb => climb.toJSON()))
})

climbsRouter.get('/:id', (request, response, next) => {
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

climbsRouter.post('/', (request, response, next) => {
  const body = request.body

  const climb = new Climb({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  climb.save()
    .then(savedClimb => {
      response.json(savedClimb.toJSON())
    })
    .catch(error => next(error))
})

climbsRouter.delete('/:id', (request, response, next) => {
  Climb.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

climbsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const climb = {
    content: body.content,
    important: body.important,
  }

  climb.findByIdAndUpdate(request.params.id, climb, { new: true })
    .then(updatedClimb => {
      response.json(updatedClimb.toJSON())
    })
    .catch(error => next(error))
})

module.exports = climbsRouter

