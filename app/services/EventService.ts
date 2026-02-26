import Event from '#models/event'
import { EventRequest } from '#validators/event_request'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'

export default class EventService {
  public async findAll(page: number, limit: number): Promise<Event[]> {
    return await Event.query()
      .select(['id', 'title', 'date', 'capacity', 'remainingSeats'])
      .paginate(page, limit)
  }

  public async findById(id: number) {
    return await Event.query()
      .select(['id', 'title', 'date', 'capacity', 'remainingSeats'])
      .where('id', id)
      .firstOrFail()
  }

  public async createEvent(id: number, payload: EventRequest) {
    return await Event.create({
      title: payload.title,
      date: DateTime.fromJSDate(payload.date),
      description: payload.description,
      capacity: payload.capacity,
      remainingSeats: payload.capacity,
      userId: id,
    })
  }
  public async editEvent(id: number, payload: EventRequest,user: User) {
    const event = await Event.findOrFail(id)
    if (user.role !== 'ADMIN' && event.id !== user.id) {
      throw new Exception('Forbidden', { status: 403 })
    }
    const reserved = event.capacity - event.remainingSeats
    if (payload.capacity !== event.capacity) {
      const newRemaining = payload.capacity - reserved
      if (newRemaining < 0) {
        throw new Exception(`Capacity cannot be less than reserved seats (${reserved})`, {
          status: 400,
        })
      }
      event.remainingSeats = newRemaining
      event.capacity = payload.capacity
    }
    event.title = payload.title ? payload.title : event.title
    event.description = payload.description ? payload.description : event.description
    event.date = payload.date ? DateTime.fromJSDate(payload.date) : event.date

    await event.save()
    return event
  }
  public async deleteEvent(id: number, user: User) {
    const event = await Event.findOrFail(id)
    if (!event) {
      throw new Exception(`Event with id ${id} not found`, { status: 404 })
    }
    if (user.role !== 'ADMIN' && event.id !== user.id) {
      throw new Exception('Forbidden', { status: 403 })
    }

    event.delete
  }
}
