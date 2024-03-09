import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { CatDTO } from './cat.dto';
import { CatEntity } from './cat.entity';
import { CatRepository } from './cat.repository';

@Injectable()
export class CatService extends AbstractService {
  constructor(
    @InjectRepository(CatRepository)
    private catRepository: CatRepository,
  ) {
    super(catRepository);
  }
  async addCat(cat: CatDTO): Promise<CatEntity> {
    return this.catRepository.createCat(cat);
  }
}
