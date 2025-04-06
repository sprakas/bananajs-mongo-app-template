import { BaseService } from '../../Core/Base/BaseService'
import UserRepo from './User.repo'
import { Request } from 'express'
import { IUser } from './User.type'

export class UserService extends BaseService<UserRepo, IUser> {
  constructor() {
    super(UserRepo)
  }

  override async get({ params }: Request) {
    return this.repo.findById(params.id)
  }
}
