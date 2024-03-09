import { Expose } from 'class-transformer';
export class CatDTO {
  catId: string;
  catName: string;
}

export class CatListDTO {
  @Expose()
  catId: string;
  @Expose()
  catName: string;
}
