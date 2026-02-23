import vine from '@vinejs/vine'


export const eventCreateValid = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).trim(),
    description: vine.string().minLength(3).maxLength(255).trim().escape(),
    date: vine.date(),
    capacity: vine.number().min(1),
  })
)
