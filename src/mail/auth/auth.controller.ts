import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from 'src/mail/users/user.dto';
import { UserEntity } from 'src/mail/users/user.entity';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  async signIn(
    @Body() authDto: AuthDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string; userName: string; accessToken: string }> {
    return await this.authService.signIn(authDto, response);
  }
  @Serialize(UserDTO)
  @Get('/me')
  async getCurrentUser(@Req() request: Request): Promise<UserEntity> {
    return await this.authService.getCurrent(request);
  }

  @Post('/logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'logout',
    };
  }
  @Post()
  addNewUser(@Body() userDto: UserDTO): Promise<UserEntity> {
    return this.authService.addUser(userDto);
  }
}
