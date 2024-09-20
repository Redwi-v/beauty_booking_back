import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateMasterDto {
  about: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  speciality: string;
}
