import { Request, Response } from 'express'

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Params,
  Query,
  SuccessResponse,
  NotFoundResponse,
} from '@banana-universe/bananajs'
import { CreateUserDto, GetUserByIdDto, GetUserListDto } from './User.dto'
import { BaseController } from '../../Core/Base/BaseController'
import { UserService } from './User.service'

@Controller('/users')
export class UserController extends BaseController<UserService> {
  constructor() {
    super(UserService)
  }

  @Post('/')
  @Body(CreateUserDto)
  async crete(req: Request, res: Response) {
    const response = await this.service.crete(req)
    return new SuccessResponse('User created successfully!', response).send(res)
  }

  @Get('/list')
  @Query(GetUserListDto)
  async list(req: Request, res: Response) {
    const response = await this.service.list(req)
    return new SuccessResponse('sucess', response).send(res)
  }

  @Get('/:id')
  @Params(GetUserByIdDto)
  async get(req: Request, res: Response) {
    const response = await this.service.get(req)
    return new SuccessResponse('sucess', response).send(res)
  }

  @Put('/:id')
  @Body(CreateUserDto, true)
  async update(req: Request, res: Response) {
    const response = await this.service.update(req)
    return new SuccessResponse('User updated successfully!', response).send(res)
  }

  @Delete('/:id')
  async delete(req: Request, res: Response) {
    console.log('hello from deele')
    const response = await this.service.delete(req)
    console.log(response)
    if (!response) throw new NotFoundResponse()
    return new SuccessResponse('User deleted successfully!', response).send(res)
  }
}
