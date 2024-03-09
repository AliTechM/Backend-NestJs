import { MailEntity } from '../mails/mails.entity';

export class ReplyDTO {
  title: string;
  date: Date;
  notes: string;
  file: string;
  mailId: MailEntity;
}
