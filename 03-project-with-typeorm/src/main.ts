import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1:
  // app.use(
  //   cookieSession({
  //     keys: ['asaflhbaf']
  //   })
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Remove additional properties from incoming requests.
  //   }),
  // );
  // 2. setupApp(app);
  // 3. Do them Globally (Global scoped pipes and middlewares) at AppModule file.

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
