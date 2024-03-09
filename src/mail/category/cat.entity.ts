import { Optional } from '@nestjs/common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MailEntity } from '../mails/mails.entity';

@Entity()
export class CatEntity {
  @PrimaryGeneratedColumn('uuid')
  catId: string;
  @Optional()
  @Column({ unique: true })
  catName: string;
  @OneToMany((_type) => MailEntity, (mail) => mail.cat, { eager: true })
  mail: MailEntity[];
}
