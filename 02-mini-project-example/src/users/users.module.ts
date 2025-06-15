import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [MessagesModule],
  // list of imported modules that export the providers which are required in this module.
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
