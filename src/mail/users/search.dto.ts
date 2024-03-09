import { IsOptional, IsString } from 'class-validator';

export class SearchDTO {
  @IsOptional()
  @IsString()
  search?: string;
}
