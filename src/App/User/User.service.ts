import { BaseService } from '../../Core/Base/BaseService'
import UserRepo from './User.repo'
import { Request } from 'express'

export class UserService extends BaseService<UserRepo> {
  constructor() {
    super(UserRepo)
  }

  override async get({ params }: Request) {
    return this.repo.findById(params.id)
  }
}
