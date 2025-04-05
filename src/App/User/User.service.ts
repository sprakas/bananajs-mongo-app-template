import { BaseService } from '../../Core/Base/BaseService'
import UserRepo from './User.repo'

export class UserService extends BaseService<UserRepo> {
  constructor() {
    super(UserRepo)
  }
}
