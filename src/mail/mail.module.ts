import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { RolesGuard } from './auth/roles.guard';

@Module({
  providers: [RolesGuard, CaslAbilityFactory],
})
export class MailModule {}
