import { Expose } from 'class-transformer';

export class MailListDto {
  @Expose()
  mailId: string;
  @Expose()
  title: string;
  @Expose()
  inNumber: string;
  @Expose()
  date: Date;
  @Expose()
  orgin: string;
  @Expose()
  urgent: string;
}
