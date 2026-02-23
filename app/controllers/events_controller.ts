import type { HttpContext } from '@adonisjs/core/http'
import EventService from '#services/EventService'
import { eventRequestValidator } from '#validators/event_request'

export default class EventsController {
  constructor(private eventService: EventService) {
    eventService = this.eventService
  }
  /**
   *
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return this.eventService.findAll()
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(eventRequestValidator)
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const event = await this.eventService.createEvent(user.id, payload)
    return response.created(event)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {

    return this.eventService.findById(params.id)
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
