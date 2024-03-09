import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CatDTO } from './cat.dto';
import { CatEntity } from './cat.entity';

@EntityRepository(CatEntity)
export class CatRepository extends Repository<CatEntity> {
  async createCat(catDto: CatDTO): Promise<CatEntity> {
    const { catName } = catDto;
    const category = this.create({ catName });
    try {
      await this.save(category);
    } catch {
      throw new InternalServerErrorException();
    }
    return category;
  }
}
