import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/mail/users/user.entity';
import { AbstractService } from 'src/shared/abstract.service';
import { MailDTO } from './mails-dto/mail.dto';
import { MailEntity } from './mails.entity';
import { MailRepository } from './mails.repository';
import { CatDTO } from '../category/cat.dto';
import { CatEntity } from '../category/cat.entity';
import { json } from 'stream/consumers';
import { FindManyOptions, MoreThan } from 'typeorm';
@Injectable()
export class MailService extends AbstractService {
  constructor(
    @InjectRepository(MailRepository)
    private mailRepository: MailRepository,
  ) {
    super(mailRepository);
  }

  // with encapsulation

  // add mail
  async addMail(
    mailDto: MailDTO,
    user: UserEntity,
    cat: CatEntity,
  ): Promise<MailEntity> {
    // return this.mailRepository.addMails(mailDto, user, cat);
    const mail = this.mailRepository.create(mailDto);
    mail.user = user;
    mail.cat = cat;
    this.mailRepository.save(mail);
    return mail;
  }

  //get mails
  async GetAllMails(user: UserEntity): Promise<MailEntity[]> {
    return this.mailRepository.getAllMails(user);
  }

  // get mail by id for current user
  async findById(id: string, user: UserEntity): Promise<MailEntity[]> {
    const found = await this.mailRepository.find({ where: { user: id } });
    if (!found) {
      throw new NotFoundException('No mails found for the current user !!');
    }
    return found;
  }
  // get mail by id with replies

  async findMailReply(id: string): Promise<MailEntity> {
    const found = await this.mailRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('No mails found for the current user !!');
    }
    return found;
  }

  // update notes
  async updateNote(
    id: string,
    notes: string,
    user: UserEntity,
  ): Promise<MailEntity> {
    const mail: MailEntity = await this.findOne(id);
    mail.notes = notes;
    await this.mailRepository.save(mail);
    return mail;
  }

  
  async deleteMail(id: string): Promise<void> {
    const deleted = await this.delete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException(`Can't find mail!`);
    }
  }

  // get with pagination
  async getMailsPage(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<MailEntity>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.mailId = MoreThan(startId);
      separateCount = await this.mailRepository.count();
    }

    const [data, count] = await this.mailRepository.findAndCount({
      where,
      order: {
        mailId: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {
      data,
      count: startId ? separateCount : count,
    };
  }
}
