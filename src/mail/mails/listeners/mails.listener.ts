import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';

@Injectable()
export class MailListener {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @OnEvent('mails_updated')
  async handleMailUpdatedEvent() {
    await this.cacheManager.del('mails_backend');

    // await this.cacheManager.reset();
  }
}
