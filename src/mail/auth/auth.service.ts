import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/mail/users/user.dto';
import { UserEntity } from 'src/mail/users/user.entity';
import { UserRepository } from 'src/mail/users/users.repository';
import { AuthDTO } from './auth.dto';
import { JwtPayload } from './jwt.payload.interface';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signIn(
    authDto: AuthDTO,
    response: Response,
  ): Promise<{ message: string; userName: string; accessToken: string }> {
    const { userName, password } = authDto;
    const user = await this.UserRepository.findOne({ userName });
    if (user && (await bcrypt.compare(password, user.password))) {
      const paylod: JwtPayload = { userName: userName };
      const accessToken: string = await this.jwtService.sign(paylod);
      response.cookie('jwt', accessToken, { httpOnly: true });
      const message = 'success';
      console.log(accessToken);
      return { message, userName, accessToken };
    } else {
      throw new UnauthorizedException('Wrong password or username !');
    }
  }
  addUser(userDto: UserDTO): Promise<UserEntity> {
    return this.UserRepository.addUser(userDto);
  }

  async getCurrent(request: Request): Promise<UserEntity> {
    const cookie = request.cookies['jwt'];
    const { userName } = await this.jwtService.verifyAsync(cookie);
    const user = await this.UserRepository.findOne({ userName });
    return user;
  }
}
