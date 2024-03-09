import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { MailEntity } from '../mails/mails.entity';
import { UserEntity } from '../users/user.entity';

@Entity()
export class ReplyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  date: Date;
  @Column()
  notes: string;
  @Column()
  file: string;
  @ManyToOne((_type) => UserEntity, (user) => user.replies, { eager: true })
  // @Exclude({ toPlainOnly: true })
  user: UserEntity;
  @ManyToOne((_type) => MailEntity, (mail) => mail.replies)
  mail: MailEntity;
}
