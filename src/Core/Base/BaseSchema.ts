import { Schema, Types } from 'mongoose'

export const BaseSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      select: false,
      default: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'user',
      // @TODO: ADD user id here
    },
    lastUpdatedBy: {
      type: Types.ObjectId,
      ref: 'user',
      // @TODO: ADD user id here
    },
  },
  { timestamps: true },
)
