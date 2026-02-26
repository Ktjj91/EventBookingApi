import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const  UserRequestValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6).maxLength(24),
  })
)

export type UserRequest = Infer<typeof UserRequestValidator>
