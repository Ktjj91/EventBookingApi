import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ReservationService from '#services/ReservationSevice'
import { ReserveRequestValidator } from '#validators/reserve'

@inject()
export default class ReservationsController {

  constructor(private readonly reservationService:ReservationService) { }

  async store({ request, auth, response, params }: HttpContext) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    const eventId = params.id
    const payload = await request.validateUsing(ReserveRequestValidator)
    const reserve = this.reservationService.reserve(eventId, payload.quantity, user)

    return response.ok(reserve)
  }

  async cancel({ params, auth, response }: HttpContext) {
    const reservationId = params.id
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    const cancelReservation = await this.reservationService.cancel(reservationId,user)

    return response.ok(cancelReservation)
  }

  async myReservations({ auth, request }: HttpContext) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user!
    request.input('page', '1')
    request.input('limit', '5')

    return this.reservationService.findAllReservationsByUserId(user)
  }

}
