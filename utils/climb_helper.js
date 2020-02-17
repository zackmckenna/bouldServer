const dummy = () => {
  return 1
}

const personalDifficultyIsNumber = climb => {
  return climb.personalDifficulty
}

const setDifficultyIsNumber = climb => {
  return climb.setDifficulty
}

const resultIsString = climb => {
  return climb.result
}

const completedIsBoolean = climb => {
  return climb.completed
}


module.exports = {
  dummy,
  personalDifficultyIsNumber,
  setDifficultyIsNumber,
  resultIsString,
  completedIsBoolean
}
