import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger Initialization
  const config = new DocumentBuilder()
    .setTitle('Cars Project')
    .setDescription('The cars API description')
    .setVersion('1.0')
    .build(); // the resulting document is a serializable object that conforms to the OpenAPI Document specification.
  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    // SwaggerDocumentOptions => https://docs.nestjs.com/openapi/introduction#document-options
  });
  SwaggerModule.setup('docs', app, documentFactory, {
    // https://docs.nestjs.com/openapi/introduction#setup-options
  });
  // docs => swagger path
  // To generate and download a Swagger JSON file, navigate to http://localhost:3000/docs-json

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
