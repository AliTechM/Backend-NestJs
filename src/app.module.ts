import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './mail/users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { configValidationSchema } from './mail/config/config.schema';
import { AuthModule } from './mail/auth/auth.module';
import { MailsModule } from './mail/mails/mails.module';
import { CaslModule } from './casl/casl.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.stage.${process.env.STAGE}`,
      validationSchema: configValidationSchema,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        synchronize: true,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: '',
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        logging: true,

      }),
    }),

    AuthModule,
    MailsModule,
    FileModule,
    MailModule,
    CaslModule,
  ],
  providers: [],
})
export class AppModule {}
