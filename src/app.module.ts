import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GoogleAuthModule } from './auth/auth.module';
import { SessionModule } from 'nestjs-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity.';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { Document } from './document/document.entity';
import { VerifyTokenMiddleware } from './auth/middleware/verify-token.middleware';

@Module({
  imports: [
    GoogleAuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [User, Document],
      synchronize: true,
    }),
    PassportModule.register({ session: true, defaultStrategy: 'google' }),
    SessionModule.forRoot({
      session: { secret: process.env.SESSION_SECRET },
    }),
    UserModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude('user/login', 'user/redirect')
      .forRoutes('*');
  }
}
