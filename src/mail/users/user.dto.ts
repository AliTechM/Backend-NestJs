import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../auth/role.enum';
import { Expose } from 'class-transformer';
export class UserDTO {
  @Expose()
  fullName: string;
  @Expose()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
  // @IsNotEmpty()
  @Expose()
  role: Role;
}
