import { BaseRepo } from '../../Core/Base/BaseRepo'
import { UserModel } from './User.model'
import { IUser } from './User.type'

class UserRepo extends BaseRepo<IUser> {
  constructor() {
    super(UserModel)
  }
}

export default UserRepo
