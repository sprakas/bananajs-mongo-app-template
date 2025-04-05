import { Request } from 'express'
import { Types } from 'mongoose'
import { BaseRepo } from './BaseRepo'

export type BaseRepoInterface<T> = BaseRepo<T>

export abstract class BaseService<T extends BaseRepoInterface<any>> {
  protected repo: T

  constructor(Repo: new () => T) {
    this.repo = new Repo()
  }

  async crete(req: Request) {
    return this.repo.create(req.body)
  }

  async list(req: Request) {
    return this.repo.find(req)
  }

  async get(req: Request) {
    return this.repo.findById<T>(new Types.ObjectId(req.params.id))
  }

  async update(req: Request) {
    return this.repo.update(new Types.ObjectId(req.params.id), req.body)
  }

  async delete(req: Request) {
    return this.repo.delete(new Types.ObjectId(req.params.id))
  }
}
