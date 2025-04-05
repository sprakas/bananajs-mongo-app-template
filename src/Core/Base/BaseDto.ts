import {
  Allow,
  IsEnum,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  IsAlphanumeric,
} from 'class-validator'
import { ObjectId } from 'mongoose'

export class BaseDto {
  @Allow()
  user!: object

  @IsOptional()
  @IsMongoId()
  createdBy!: ObjectId

  @IsOptional()
  @IsMongoId()
  lastUpdatedBy!: ObjectId
}

enum Sort {
  asc = 'asc',
  desc = 'desc',
}

export class ResourceDto {
  @IsNumberString()
  @IsOptional()
  @Length(0, 2)
  @Length(0, 2)
  limit!: string

  @IsNumberString()
  @IsOptional()
  @Length(0, 2)
  @Length(0, 2)
  page!: string

  @IsOptional()
  @IsAlphanumeric()
  search?: string

  @IsEnum(Sort)
  @IsOptional()
  sort?: 'asc' | 'desc'

  @IsString()
  @IsOptional()
  @Length(3, 50)
  orderBy?: string

  @IsOptional()
  //@Todo: FixMe with Strong type
  @IsString()
  filters?: string

  @IsString()
  @IsOptional()
  @Length(3, 50)
  dateFrom?: string

  @IsString()
  @IsOptional()
  @Length(3, 50)
  dateTo?: string
}

export class IdDto {
  @IsMongoId()
  id!: ObjectId
}
