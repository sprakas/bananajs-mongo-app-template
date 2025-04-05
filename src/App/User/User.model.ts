import { Schema, model } from 'mongoose'
import { BaseSchema } from '../../Core/Base/BaseSchema'
import { IUser } from './User.type'

export const USER_MODEL = 'user'

const schema = new Schema<IUser>({
  email: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },

  password: {
    type: String,
    select: false,
  },
})

schema.add(BaseSchema)

export const UserModel = model<IUser>(USER_MODEL, schema)
