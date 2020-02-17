const climbHelper = require('../utils/climb_helper')

test('dummy returns one', () => {
  const climbs = []

  const result = climbHelper.dummy(climbs)
  expect(result).toBe(1)
})
