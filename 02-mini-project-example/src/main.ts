import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Only the top-level module (not feature modules like UsersModule, MessagesModule, etc.)
  // should be passed to NestFactory.create().
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
