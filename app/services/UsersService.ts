import { UserRequest } from '#validators/user_request'
import User from '#models/user'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export default class UsersService {
  public async register(payload: UserRequest){
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)
    return { token: token.value!.release() }
  }

  public async login(payload: UserRequest, auth: Authenticator<Authenticators>) {
    const user = await User.verifyCredentials(payload.email, payload.password)
    const token = await auth.use('api').createToken(user, ['ROLE_USER'], {
      expiresIn: '60m'
    })
    return { token: token.value!.release()}
  }

  async destroy(auth: Authenticator<Authenticators>) {
    await auth.use('api').invalidateToken()
  }
}
