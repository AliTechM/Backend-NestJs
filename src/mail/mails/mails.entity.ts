import { Optional } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/mail/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatEntity } from '../category/cat.entity';
import { ReplyEntity } from '../reply/reply.entity';

@Entity()
export class MailEntity {
  @PrimaryGeneratedColumn('uuid') mailId: string;
  @Column({
    nullable: true,
  })
  inNumber: string;
  @Column({
    nullable: true,
  })
  outNumber: string;
  @Column({
    nullable: true,
  })
  inDate: Date;
  @Column({
    nullable: true,
  })
  outDate: Date;
  @Column({
    nullable: true,
  })
  title: string;
  @Column({
    nullable: true,
  })
  orgin: string;
  @Column({
    nullable: true,
  })
  fromMail: string;
  @Column({
    nullable: true,
  })
  number: string;
  @Column({
    nullable: true,
  })
  date: Date;
  @Column({
    nullable: true,
  })
  type: string;
  @Column({
    nullable: true,
  })
  date_presenting: Date;
  @Column({
    nullable: true,
  })
  urgent: boolean;
  @Column({
    nullable: true,
  })
  urgent_by: string;
  @Column({
    nullable: true,
  })
  status: string;
  @Column({
    nullable: true,
  })
  saved_place: string;
  @Column({
    nullable: true,
  })
  notes: string;
  @Column({
    nullable: true,
  })
  file: string;
  @ManyToOne((_type) => UserEntity, (user) => user.mail)
  user: UserEntity;
  @ManyToOne((_type) => CatEntity, (cat) => cat.mail)
  @Exclude({ toPlainOnly: true })
  cat: CatEntity;
  @OneToMany((_type) => ReplyEntity, (reply) => reply.mail)
  // @Exclude({ toPlainOnly: true })
  replies: ReplyEntity[];
}
