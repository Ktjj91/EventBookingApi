import factory from '@adonisjs/lucid/factories'
import Event from '#models/event'
import { DateTime } from 'luxon'

export const EventFactory = factory
  .define(Event, async ({ faker }) => {
    const capacity = faker.number.int({ min: 300, max: 700 })
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      date: DateTime.fromJSDate(faker.date.past()),
      capacity,
      remainingSeats: capacity,
    }
  })
  .build()
