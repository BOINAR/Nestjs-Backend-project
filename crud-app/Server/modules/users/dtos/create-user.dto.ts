import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  isString,
  isEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly age?: number;
}
