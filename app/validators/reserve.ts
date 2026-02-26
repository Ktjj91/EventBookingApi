import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { UserRequestValidator } from '#validators/user_request'

export const ReserveRequestValidator = vine.compile(
  vine.object({
    quantity: vine.number().min(1).positive(),
  })
)


export type ReserveRequest = Infer<typeof UserRequestValidator>
