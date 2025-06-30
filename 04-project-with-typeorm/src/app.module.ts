import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

// In NestJS, .forRoot() is a convention used by modules
// to provide a way to configure global or singleton services when importing a module.
// The configure shared into all the modules inside our app.

// We use .forFeature() in feature modules if needed (e.g., for specific entities or models).
// The configure shared into the specific module.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // We do not have to re-import config module to all other modules.
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // With access to ConfigService through the dependency injection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // ConfigService should have all our config info inside of it from our chosen file.
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          // entities: [User, Report], // All entities must be explicitly listed here so the ORM manage them properly. Or:
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    /*
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite'
      entities: [User],
      // entities: all the entities we want store in our application.
      synchronize: true,
      // Indicates if database schema should be auto created on every application launch (Just for dev or debug use).
      // If entities were changed, typeorm will automatically reflect those changes.
      // Otherwise, we would need to run a migration to apply entities (tables) updates manually.
    }),
    */
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Globally scoped pipes (applied to all incoming requests)
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // Globally scoped middlewares (called automatically for all incoming requests)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasfd'],
        }),
      )
      .forRoutes('*');
  }
}
