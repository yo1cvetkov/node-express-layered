import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(10)
  username?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password?: string;
}
