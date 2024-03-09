import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { MailEntity } from '../mails/mails.entity';
import { UserEntity } from '../users/user.entity';
import { ReplyDTO } from './reply.dto';
import { ReplyEntity } from './reply.entity';
import { ReplyRepository } from './reply.repository';

@Injectable()
export class ReplyService extends AbstractService {
  constructor(
    @InjectRepository(ReplyRepository)
    private replyRepository: ReplyRepository,
  ) {
    super(replyRepository);
  }
  async addReply(reply: ReplyDTO, user: UserEntity): Promise<ReplyEntity> {
    const replies = this.replyRepository.create(reply);
    replies.mail = reply.mailId;
    replies.user = user;
    this.replyRepository.save(replies);
    return replies;
  }
  async GetAllReplies(mail: MailEntity): Promise<ReplyEntity[]> {
    return this.replyRepository.getReplies(mail);
  }

  async findReplyUser(id: MailEntity): Promise<ReplyEntity[]> {
    const found = await this.replyRepository.find({
      where: { mail: id },
      relations: ['user'],
    });
    if (!found) {
      throw new NotFoundException('No replies found for the current user !!');
    }
    return found;

    
  }
}
