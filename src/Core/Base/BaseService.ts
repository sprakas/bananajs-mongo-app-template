import { Request } from 'express'
import { BaseRepo } from './BaseRepo'

export type BaseRepoInterface<T> = BaseRepo<T>

export abstract class BaseService<T extends BaseRepoInterface<U>, U> {
  protected repo: T

  constructor(Repo: new () => T) {
    this.repo = new Repo()
  }

  async crete({ body }: Request) {
    return this.repo.create(body)
  }

  async list({ query }: Request) {
    return this.repo.find(query as Partial<U>)
  }

  async get({ params }: Request) {
    return this.repo.findById(params.id)
  }

  async update({ params, body }: Request) {
    return this.repo.update(params.id, body)
  }

  async delete({ params }: Request) {
    return this.repo.delete(params.id)
  }
}
