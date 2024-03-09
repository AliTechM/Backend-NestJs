import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { CatController } from '../category/cat.controller';
import { CatRepository } from '../category/cat.repository';
import { CatService } from '../category/cat.services';
import { ReplyController } from '../reply/reply.controller';
import { ReplyRepository } from '../reply/reply.repository';
import { ReplyService } from '../reply/reply.service';
import { MailListener } from './listeners/mails.listener';
import { MailService } from './mail.service';
import { MailController } from './mails.controllers';
import { MailRepository } from './mails.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailRepository, CatRepository, ReplyRepository]),
    AuthModule,
    CaslModule,
    SharedModule,
  ],
  controllers: [MailController, CatController, ReplyController],
  providers: [MailService, CatService, ReplyService, MailListener],
})
export class MailsModule {}
