import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Event from '#models/event'
import * as relations from '@adonisjs/lucid/types/relations'
import Reservation from '#models/reservation'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare role: 'ADMIN' | 'USER'

  @hasMany(() => Event, {
    foreignKey: 'userId',
  })
  declare events: relations.HasMany<typeof Event>

  @hasMany(() => Reservation, {
    foreignKey: 'userId',
  })
  declare reservations: relations.HasMany<typeof Reservation>


  static accessTokens = DbAccessTokensProvider.forModel(User)
}
