import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import { EventFactory } from '#database/factories/event_factory'
import Reservation from '#models/reservation'

export default class extends BaseSeeder {
  async run() {
    const users = await UserFactory.createMany(10)

    const events = await Promise.all(
      Array.from({ length: 10 }).map(() => {
        const randomUser = users[Math.floor(Math.random() * users.length)]

        return EventFactory.merge({
          userId: randomUser.id,
        }).create()
      })
    )

    const used = new Set<string>()

    for (let i = 0; i < 40; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const event = events[Math.floor(Math.random() * events.length)]
      const key = `${user.id}:${event.id}`

      if (used.has(key)) continue
      used.add(key)

      // si tu veux rester cohérent avec remainingSeats
      if (event.remainingSeats <= 0) continue

      const quantity = 1 // simple
      if (event.remainingSeats < quantity) continue

      await Reservation.create({
        userId: user.id,
        eventId: event.id,
        quantity,
        status: 'ACTIVE',
      })
      event.remainingSeats -= quantity
      await event.save()
    }
  }
}
