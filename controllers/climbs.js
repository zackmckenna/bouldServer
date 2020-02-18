const climbsRouter = require('express').Router()
const Climb = require('../models/climb')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

climbsRouter.get('/', async (request, response) => {
  const climbs = await Climb
    .find({}).populate('user', { username: 1, name: 1 })
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

climbsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = getTokenFrom(request)
  console.log(token)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await user.findById(body.userId)

    const climb = new Climb({
      personalDifficulty: body.personalDifficulty,
      setDifficulty: body.setDifficulty,
      result: body.result,
      holdReached: body.holdReached,
      date: new Date(),
      user: user._id
    })
    const savedClimb = await climb.save()
    user.climbs = user.climbs.concat(savedClimb._id)
    await user.save()
    response.json(savedClimb.toJSON())
  } catch(exception) {
    next(exception)
  }
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

