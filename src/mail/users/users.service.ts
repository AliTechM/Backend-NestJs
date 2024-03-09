import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError, take } from 'rxjs';
import { SearchDTO } from './search.dto';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { userInterface } from './user.interface';
import { UserRepository } from './users.repository';
import { Connection } from 'typeorm';
import { string } from 'joi';
import { Request } from 'express';
import { AbstractService } from 'src/shared/abstract.service';
@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super(userRepository);
  }

  // before absraction

  async findById(id: string): Promise<UserEntity> {
    const found = await this.userRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`can't find user with ID =${id}`);
    } else {
      return found;
    }
  }

 

  // after absraction

  // call procedure
  async execProcedure(): Promise<UserEntity[]> {
    const email = 'hi';
    const result = await this.userRepository.query(`call GetUsers('${email}')`);
    console.log('stored procedure ' + result);
    return result;
  }
}
