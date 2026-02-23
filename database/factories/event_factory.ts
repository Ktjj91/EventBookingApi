import factory from '@adonisjs/lucid/factories'
import Event from '#models/event'

export const EventFactory = factory
  .define(Event, async ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      date: faker.date.past(),
      capacity: faker.number.int({ min: 300, max: 700 }),
      remainingSeats: faker.number.int({ min: 1, max: 5 }),
    }
  })
  .build()
