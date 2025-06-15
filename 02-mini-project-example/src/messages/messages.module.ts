import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';

// Here, we group related controllers and providers, and manage dependency imports for the application.

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  // providers: things that can be used as dependencies for other classes within the same module (Injectable).
  exports: [MessagesService]
  // exports: list of the subset of providers that are provided by this module
  // and should be available in other modules which import this module.
  // By default the providers doesn't automatically shared anywhere inside the project.
  // To use a provider elsewhere, the module must 'export' it,
  // and the consuming module must 'import' this module.
})
export class MessagesModule {}
