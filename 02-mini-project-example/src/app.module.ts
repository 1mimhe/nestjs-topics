import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

// This root module imports all other feature modules and serves as the entry point for the application.
// We can also have global or root-level controllers and services (usually minimal here).

@Module({
  imports: [UsersModule, MessagesModule]
})
export class AppModule {}
