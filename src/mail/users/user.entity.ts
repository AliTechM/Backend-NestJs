import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../auth/role.enum';
import { MailEntity } from '../mails/mails.entity';
import { ReplyEntity } from '../reply/reply.entity';
import { Exclude } from 'class-transformer';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() fullName: string;
  @Column({ unique: true }) userName: string;
  @Column() @Exclude() password: string;
  @Column() role: Role;
  @OneToMany((_type) => MailEntity, (mail) => mail.user, { eager: true })
  @Exclude({ toPlainOnly: true })
  mail: MailEntity[];
  @OneToMany((_type) => ReplyEntity, (replies) => replies.user, {
    eager: false,
  })
  @Exclude({ toPlainOnly: true })
  replies: ReplyEntity[];
}
