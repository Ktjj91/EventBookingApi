import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
const EventController = () => import('#controllers/events_controller')
const UsersController = () => import('#controllers/users_controller')
const ReservationController = () => import('#controllers/reservations_controller')

router
  .resource('/api/events', EventController)
  .apiOnly()
  .middleware(['store', 'destroy', 'update'], middleware.auth({ guards: ['api'] }))

router.post('/api/auth/login', [UsersController, 'login'])
router.post('/api/auth/register', [UsersController, 'register'])
router.delete('/api/auth/logout', [UsersController, 'logout'])

router
  .get('/api/me', async ({ auth }) => {
    await auth.use('api').authenticate()
    return auth.use('api').user
  })
  .use(middleware.auth({ guards: ['api'] }))

router
  .post('/api/reserves/:id', [ReservationController, 'store'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .patch('/api/reserves/cancel/:id', [ReservationController, 'cancel'])
  .use(middleware.auth({ guards: ['api'] }))
router
  .get('/api/reserves/', [ReservationController, 'myReservations'])
  .use(middleware.auth({ guards: ['api'] }))

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})
