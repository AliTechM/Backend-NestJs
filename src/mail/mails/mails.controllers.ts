import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';

import { UserEntity } from 'src/mail/users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { editFileName, imageFileFilter } from '../../file/file-upload.utils';
import { MailDTO } from './mails-dto/mail.dto';
import { MailService } from './mail.service';
import { MailEntity } from './mails.entity';
import { Roles } from '../auth/roles.decorator';
import { Action, Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { CheckPolicies } from 'src/casl/policy.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { MailListDto } from './mails-dto/mail-list.dto';
import { SerializePage } from 'src/shared/interceptors/serialize-paging.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatEntity } from '../category/cat.entity';
import { ReplyEntity } from '../reply/reply.entity';
import { PaginationParams } from 'src/shared/pagination';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Response } from 'express';
import { SearchDTO } from '../users/search.dto';
@Controller('mails')
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}
  // add new mail
  @Post()
  @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  creatMail(
    @Body() mailDto: MailDTO,
    @GetUser() user: UserEntity,
  ): Promise<MailEntity> {
    const { catCatID } = mailDto;
    const cat2 = new CatEntity();
    cat2.catId = catCatID;
    const mail = this.mailService.addMail(mailDto, user, cat2);
    this.eventEmitter.emit('mails_updated');
    return mail;
  }

  //get all mails
  @Get()
  @Roles(Role.Admin)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, MailEntity))
  findall(@GetUser() user: UserEntity): Promise<MailEntity[]> {
    return this.mailService.GetAllMails(user);
  }
  // get by user id
  @Get('/mailsbyid/:id')
  GetById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<MailEntity[]> {
    return this.mailService.findById(id, user);
  }

  // get mail by it's id
  @Get('/mail/:id')
  async getThisMail(@Param('id') id: string) {
    const mail = await this.mailService.findMailReply(id);
    // const replies = mail.replies;
    // const user = mail.user;
    return mail;
  }

 

  // update with abstraction
  @Patch('/:id/notes')
  updatePass(@Param('id') id: string, @Body('notes') notesVal: string) {
    const updated = this.mailService.update(id, { notes: notesVal });
    this.eventEmitter.emit('mails_updated');
    return updated;
  }

  //delete email
  @Delete('/:id')
  deleteTheUser(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.mailService.deleteMail(id);
  }

  // get mail using cache
  @SerializePage(MailListDto)
  @Get('/list')
  async GetList(@Req() request: Request, @Query() searchDto: SearchDTO) {
    let mails = await this.cacheManager.get<MailListDto[]>('mails_backend');
    if (!mails) {
      mails = await this.mailService.find();
      await this.cacheManager.set('mails_backend', mails, { ttl: 1800 });
    }

    if (request.query.sort === 'asc' || request.query.sort === 'desc') {
      mails.sort((a, b) => {
        let dir = 1;
        request.query.sort === 'asc' ? (dir = -1) : dir;
        if (a.inNumber.toLowerCase() > b.inNumber.toLowerCase()) {
          return -1 * dir;
        }
        if (a.inNumber.toLowerCase() < b.inNumber.toLowerCase()) {
          return 1 * dir;
        }
        return 0;
      });
    }
    const page: number = parseInt(request.query.page as any) || 1;
    const perPage = 10;
    const total = mails.length;
    const data = mails.slice((page - 1) * perPage, page * perPage);
    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / perPage),
    };
  }
  @Get('/backend')
  async backend(@Req() request: Request) {
    let mails = await this.cacheManager.get<MailEntity[]>('mails_backend');

    if (!mails) {
      mails = await this.mailService.find();

      await this.cacheManager.set('mails_backend', mails, { ttl: 1800 });
    }
    if (request.query.s) {
      const searchTerm = request.query.s.toString().toLowerCase();
      mails = mails.filter(
        (p) =>
          p.title.toLowerCase().indexOf(searchTerm) >= 0 ||
          p.number.toLowerCase().indexOf(searchTerm) >= 0,
      );
    }

    if (request.query.sort === 'asc' || request.query.sort === 'desc') {
      mails.sort((a, b) => {
        let dir = 1;
        request.query.sort === 'asc' ? (dir = -1) : dir;
        if (a.inNumber.toLowerCase() > b.inNumber.toLowerCase()) {
          return -1 * dir;
        }
        if (a.inNumber.toLowerCase() < b.inNumber.toLowerCase()) {
          return 1 * dir;
        }
        return 0;
      });
    }
    const page: number = parseInt(request.query.page as any) || 1;
    const perPage = 9;
    const total = mails.length;
    const data = mails.slice((page - 1) * perPage, page * perPage);
    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / perPage),
    };
  }

  // file upload
  @Post('/single')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename(_, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      url: `/mails/files/${file.filename}`,
    };
    return response;
  }

  @Get('files/:path')
  async getImage(@Param('path') path, @Res() res: Response) {
    res.sendFile(path, { root: 'files' });
  }
  // end file single upload

  @Get('/paging')
  async getPosts(@Query() { startId, offset, limit }: PaginationParams) {
    return this.mailService.getMailsPage(startId, offset, limit);
  }


}
