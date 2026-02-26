import type { HttpContext } from '@adonisjs/core/http'
import EventService from '#services/EventService'
import { eventRequestValidator } from '#validators/event_request'
import { inject } from '@adonisjs/core'

@inject()
export default class EventsController {
  constructor(private readonly eventService: EventService) {
    this.eventService = eventService
  }
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    return this.eventService.findAll(page, limit)
  }
  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(eventRequestValidator)
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    if (user.role !== 'ADMIN')
      return response.status(400).send({ message: 'Only admins can create events' })
    const event = await this.eventService.createEvent(user.id, payload)
    return response.created(event)
  }
  async show({ params }: HttpContext) {
    return this.eventService.findById(params.id)
  }

  /**
   * Edit individual record
   */
  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(eventRequestValidator)
    const id = params.id
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    const updateEvent = await this.eventService.editEvent(id, payload, user)
    return response.ok(updateEvent)
  }
  async destroy({ params, response, auth }: HttpContext) {
    const id = params.id
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    await this.eventService.deleteEvent(id, user)
    return response.noContent()
  }
}
