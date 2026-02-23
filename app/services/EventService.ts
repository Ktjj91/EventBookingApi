import Event from '#models/event'
import { EventRequest } from '#validators/event_request'
import { DateTime } from 'luxon'

export default class EventService {

  public findAll(){
    return Event.all()
  }

  public findById(id: number) {
    return Event.findOrFail(id)
  }

  public async createEvent(id: number, payload: EventRequest) {
    return await Event.create({
      title: payload.title,
      date: DateTime.fromJSDate(payload.date),
      description: payload.description,
      capacity: payload.capacity,
      remainingSeats: 0,
      userId: id,
    })
  }

  /**
   * Todo
   * @param id
   * @param payload
   */
  public async editEvent(id: number, payload: EventRequest) {
    const event = await Event.findOrFail(id)
    event.merge({ ...payload, date: DateTime.fromJSDate(payload.date) })
    await event.save()
    return event
  }
}
