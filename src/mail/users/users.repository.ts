import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SearchDTO } from './search.dto';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async getAllUsers(filterDto: SearchDTO): Promise<UserEntity[]> {
    const search = Object.values(filterDto);
    const query = this.createQueryBuilder('user');
    if (search) {
      query.andWhere(
        '(LOWER(user.fullName) LIKE LOWER(:search) OR LOWER(user.role) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const users = await query.getMany();
    return users;
  }
  async addUser(userDto: UserDTO): Promise<UserEntity> {
    const { fullName, userName, password, role } = userDto;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const user = this.create({
      fullName,
      userName,
      password: hashedPass,
      role,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate user name
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}
