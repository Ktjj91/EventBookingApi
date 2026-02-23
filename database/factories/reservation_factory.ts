import factory from '@adonisjs/lucid/factories'
import Reservation from '#models/reservation'
import { UserFactory } from '#database/factories/user_factory'
import { EventFactory } from '#database/factories/event_factory'

export const ReservationFactory = factory
  .define(Reservation, async ({ faker }) => {
    return {
      quantity: faker.number.int({ min: 1, max: 5 }),
      status: 'ACTIVE',
    }
  })
  .relation('user', () => UserFactory)
  .relation('event', () => EventFactory)
  .build()
