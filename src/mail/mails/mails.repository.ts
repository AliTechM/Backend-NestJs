import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UserEntity } from 'src/mail/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CatDTO } from '../category/cat.dto';
import { CatEntity } from '../category/cat.entity';
import { MailDTO } from './mails-dto/mail.dto';
import { MailEntity } from './mails.entity';
@EntityRepository(MailEntity)
export class MailRepository extends Repository<MailEntity> {
  private logger = new Logger('MailsRepository');
  
  async getAllMails(user: UserEntity): Promise<MailEntity[]> {
    const query = this.createQueryBuilder('mail');
    query.where({ user });

    try {
      const mails = await query.getMany();
      return mails;
    } catch (error) {
      this.logger.error(
        `Failed to get mails for user "${user.userName}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
