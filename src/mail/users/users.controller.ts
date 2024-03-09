import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SearchDTO } from './search.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private userService: UsersService) {}
  //   @Post()
  //   @HttpCode(204)
  //   @Header('Cache-Control', 'none')
  //   @Redirect('https://nestjs.com', 301)
  //   async create(@Body() userDto: UserDTO) {
  //     this.userService.create(userDto);
  //   }

  //   @Get()
  //   async findall(@Query() searchDto: SearchDTO): Promise<userInterface[]> {
  //     if (Object.keys(searchDto).length) {
  //       return this.userService.searchUsers(searchDto);
  //     } else {
  //       return this.userService.findAll();
  //     }
  //   }

  @Get()
  findall(@Query() searchDto: SearchDTO): Promise<UserEntity[]> {
    return this.userService.find();
    // return this.userService.GetAllUsers(searchDto);
  }

  //   @Get('/:role')
  //   findById(@Param('role') role: number): userInterface {
  //     return this.userService.findById(role);
  //   }

  //   @Put(':id')
  //   update(@Param('id') id: string, @Body() userDto: UserDTO) {
  //     return `This action updates a #${id} cat`;
  //   }
  @Delete('/:id')
  deleteTheUser(@Param('id') id: string): Promise<DeleteResult> {
    // return this.userService.deleteUser(id);
    return this.userService.delete(id);
  }

  @Patch('/:id/password')
  updatePass(
    @Param('id') id: string,
    @Body('password') pass: string,
  ): Promise<UpdateResult> {
    return this.userService.update(id, pass);
  }
}
