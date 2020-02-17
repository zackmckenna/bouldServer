const climbsRouter = require('express').Router()
const Climb = require('../models/climb')

climbsRouter.get('/', (request, response) => {
  Climb.find({}).then(climbs => {
    response.json(climbs.map(climb => climb.toJSON()))
  })
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

// const notesRouter = require('express').Router()
// const Note = require('../models/note')

// notesRouter.get('/', (request, response) => {
//   Note.find({}).then(notes => {
//     response.json(notes.map(note => note.toJSON()))
//   })
// })

// notesRouter.get('/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note.toJSON())
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// notesRouter.post('/', (request, response, next) => {
//   const body = request.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     date: new Date()
//   })

//   note.save()
//     .then(savedNote => {
//       response.json(savedNote.toJSON())
//     })
//     .catch(error => next(error))
// })

// notesRouter.delete('/:id', (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// notesRouter.put('/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote.toJSON())
//     })
//     .catch(error => next(error))
// })

// module.exports = notesRouter
