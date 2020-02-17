const climbHelper = require('../utils/climb_helper')

test('dummy returns one', () => {
  const climbs = []

  const result = climbHelper.dummy(climbs)
  expect(result).toBe(1)
})

test('personal difficulty is a number', () => {
  const climb = {
    id: 3,
    personalDifficulty: 3,
    setDifficulty: 4,
    result: 'uncomplete',
    completed: false
  }

  const result = climbHelper.personalDifficultyIsNumber(climb)
  expect(result).toBe(3)
})

// const personalDifficultyIsNumber = climb => {
//   return climb.personalDifficulty
// }

// const setDifficultyIsNumber = climb => {
//   return climb.setDifficulty
// }

// const resultIsString = climb => {
//   return climb.result
// }

// const completedIsBoolean = climb => {
//   return climb.completed
// }
