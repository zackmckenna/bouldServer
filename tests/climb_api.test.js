const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Climb = require('../models/climb')

const initialClimbs = [
  {
    id: 1,
    personalDifficulty: 1,
    setDifficulty: 2,
    result: 'redpoint',
    completed: false,
    date: '2020-02-17T00:56:03.306Z'
  },
  {
    id: 2,
    personalDifficulty: 1,
    setDifficulty: 3,
    result: 'flash',
    completed: false,
    date: '2020-02-17T00:56:03.306Z'
  },
  {
    id: 3,
    personalDifficulty: 3,
    setDifficulty: 4,
    result: 'uncomplete',
    completed: false,
    date: '2020-02-17T00:56:03.306Z'
  }
]

beforeEach(async () => {
  await Climb.deleteMany({})
  let climbObject = new Climb(initialClimbs[0])
  await climbObject.save()

  climbObject = new Climb(initialClimbs[1])
  await climbObject.save()

  climbObject = new Climb(initialClimbs[2])
  await climbObject.save()
})

const api = supertest(app)

test('climbs are returned as json', async () => {
  await api
    .get('/api/climbs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all climbs are returned', async () => {
  const response = await api.get('/api/climbs')

  expect(response.body.length).toBe(initialClimbs.length)
})

test('a specific climb is within the returned climbs', async () => {
  const response = await api.get('/api/climbs')

  const contents = response.body.map(r => r.result)

  expect(contents).toContain(
    'flash'
  )
})

afterAll(() => {
  mongoose.connection.close()
})
