import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import Event from '#models/event'
import Reservation from '#models/reservation'
import { Exception } from '@adonisjs/core/exceptions'

export default class ReservationService {
  public async reserve(eventId: number, quantity: number, user: User) {
    if (quantity <= 0) throw new Exception('Quantity must be > 0', { status: 422 })

    return await db.transaction(async (trx) => {
      const evt = await Event.query({ client: trx }).where('id', eventId).forUpdate().firstOrFail()
      if (evt.remainingSeats < quantity) {
        throw new Exception('Not enough seats available', { status: 409 })
      }

      const existingReservation = await Reservation.query({ client: trx })
        .where('eventId', eventId)
        .where('userId', user.id)
        .forUpdate()
        .first()
      if (existingReservation && existingReservation.status === 'ACTIVE') {
        throw new Exception('You already have an active reservation for this event', {
          status: 409,
        })
      }
      if (existingReservation) {
        existingReservation.status = 'ACTIVE'
        existingReservation.quantity += quantity
        await existingReservation.useTransaction(trx).save()
      } else {
        await Reservation.create(
          {
            eventId,
            userId: user.id,
            quantity: quantity,
            status: 'ACTIVE',
          },
          { client: trx }
        )
      }

      evt.remainingSeats -= quantity
      await evt.useTransaction(trx).save()
      return {
        reserved: quantity,
        remainingSeats: evt.remainingSeats,
      }
    })
  }

  public async cancel(reservationId: number, user: User) {
    return await db.transaction(async (trx) => {
      const reservation = await Reservation.query()
        .where('id', reservationId)
        .forUpdate()
        .firstOrFail()

      if (user.role !== 'ADMIN' && reservation.userId !== user.id) {
        throw new Exception('Forbidden', { status: 403 })
      }
      if (reservation.status === 'CANCELED') {
        return reservation
      }
      const evt = await Event.query().where('id', reservation.eventId).forUpdate().firstOrFail()

      reservation.status = 'CANCELED'
      await reservation.useTransaction(trx).save()

      evt.remainingSeats = Math.min(evt.capacity, evt.remainingSeats + reservation.quantity)
      await evt.useTransaction(trx).save()
      await reservation.load('event')

      return {
        status: reservation.status,
        message: `The event ${reservation.event.title} is cancelled`,
      }
    })
  }

  async findAllReservationsByUserId(user: User) {
    await user.load('reservations', (query) => {
      query.preload('event', (eq) => eq.select(['id', 'title', 'date']))
    })
    return user.reservations
  }
}
