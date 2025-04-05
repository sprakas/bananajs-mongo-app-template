import { IBaseType } from '../../Core/Base/BaseType'

export interface IUser extends IBaseType {
  email: string
  name: string
  password: string
}
