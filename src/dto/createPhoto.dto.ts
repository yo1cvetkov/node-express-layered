import { Contains, IsBoolean, IsInt, IsNotEmpty, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: "Name is too short. Minimal length is $constraint1 characters",
  })
  @MaxLength(20, {
    message: "Name is too long. Maximal length is $constraint1 characters.",
  })
  name?: string;

  @IsString()
  @Length(10, 50)
  description?: string;

  @IsString()
  @Contains(".")
  filename?: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  views?: number;

  @IsBoolean()
  isPublished?: boolean;
}
