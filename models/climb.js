const mongoose = require('mongoose')

const climbSchema = new mongoose.Schema({
  personalDifficulty: {
    type: Number,
    required: true
  },
  setDifficulty: {
    type: Number,
    required: true
  },
  result: String,
  completed: Boolean,
  date: {
    type: Date,
    required: true
  },
  note: String
})

climbSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Climb', climbSchema)
