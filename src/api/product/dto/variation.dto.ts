import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVariationDto {
  @IsString()
  @IsNotEmpty()
  sizeCode: string;

  @IsString()
  @IsNotEmpty()
  colorName: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}
