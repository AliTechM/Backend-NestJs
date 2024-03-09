import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReplyDTO } from './reply.dto';
import { ReplyEntity } from './reply.entity';
import { ReplyService } from './reply.service';
import { MailEntity } from '../mails/mails.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
@Controller('reply')
@UseGuards(JwtAuthGuard)
export class ReplyController {
  constructor(
    private replyService: ReplyService,
    private eventEmitter: EventEmitter2,
  ) {}
  @Post()
  addReply(
    @Body() replyDto: ReplyDTO,
    @GetUser() user: UserEntity,
  ): Promise<ReplyEntity> {
    const reply = this.replyService.addReply(replyDto, user);
    this.eventEmitter.emit('mails_updated');
    return reply;
  }
  @Get()
  getReplies(@Query('id') id: MailEntity): Promise<ReplyEntity[]> {
    const result = this.replyService.findReplyUser(id);
    return result;
  }
}
