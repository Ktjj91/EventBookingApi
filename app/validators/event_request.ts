import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'


export const eventRequestValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).trim(),
    description: vine.string().minLength(3).maxLength(255).trim().escape(),
    date: vine.date(),
    capacity: vine.number().min(1),
  })
)

export type EventRequest = Infer<typeof eventRequestValidator>
