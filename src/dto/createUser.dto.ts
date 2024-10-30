import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  username?: string;

  @IsString()
  @MinLength(5)
  password?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  firstName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10)
  lastName?: string;
}
