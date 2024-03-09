import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { MailEntity } from '../mails/mails.entity';
import { ReplyDTO } from './reply.dto';
import { ReplyEntity } from './reply.entity';

@EntityRepository(ReplyEntity)
export class ReplyRepository extends Repository<ReplyEntity> {
  private logger = new Logger('ReplyRepository');

  async getReplies(mail: MailEntity) {
    const query = this.createQueryBuilder('reply');
    query.where('reply.mailId = :id', { id: mail.mailId });

    try {
      const replies = await query.getMany();
      console.log('replies :' + JSON.stringify(replies));
      return replies;
    } catch (error) {
      this.logger.error(`Failed to get replies for mail `, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
