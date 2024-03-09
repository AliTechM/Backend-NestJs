import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/mail/auth/get-user.decorator';
import { Role } from 'src/mail/auth/role.enum';
import { Roles } from 'src/mail/auth/roles.decorator';
import { RolesGuard } from 'src/mail/auth/roles.guard';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { UserEntity } from '../users/user.entity';
import { CatDTO, CatListDTO } from './cat.dto';
import { CatEntity } from './cat.entity';
import { CatService } from './cat.services';

@Controller('cat')
// @UseGuards(AuthGuard())
export class CatController {
  constructor(private catService: CatService) {}
  @Post()
  @Roles(Role.Admin)
  addNewUser(@Body() catDto: CatDTO): Promise<CatEntity> {
    return this.catService.addCat(catDto);
  }

  @Serialize(CatListDTO)
  @Get()
  async getCateg(): Promise<CatEntity[]> {
    return await this.catService.find();
  }
}
