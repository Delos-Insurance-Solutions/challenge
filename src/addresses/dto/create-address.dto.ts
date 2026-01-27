import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address!: string;
}
