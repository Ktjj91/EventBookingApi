import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UsersService from '#services/UsersService'
import { UserRequestValidator } from '#validators/user_request'

@inject()
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  public async login({ request, auth }: HttpContext) {
    const user = await request.validateUsing(UserRequestValidator)
    return this.usersService.login(user, auth)
  }

  public async register({ request }: HttpContext) {
    const user = await request.validateUsing(UserRequestValidator)
    return this.usersService.register(user)
  }

  public async logout({ auth }: HttpContext) {
    return await this.usersService.destroy(auth)
  }

  public isAuthenticated({ auth, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.status(401).json({ error: 'Authentication failed' })
    }
    return auth.isAuthenticated
  }
}
