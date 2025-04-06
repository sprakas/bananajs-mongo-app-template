import { ClientSession, Types } from 'mongoose'

export interface IBaseType {
  _id?: Types.ObjectId
  isDeleted?: boolean
  createdBy?: string
  lastUpdatedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface IRepoOptions {
  session?: ClientSession
  new?: boolean
  populate?: string
  upsert?: boolean
}

export interface IFilterItems {
  [key: string]: string | number | string[]
}

export interface IResource {
  search?: string
  sort?: 'asc' | 'desc'
  orderBy?: string
  page?: string
  limit?: string
  filters?: string
  dateFrom?: string
  dateTo?: string
}

export interface IResourceOptions {
  searchFields?: string[]
}
