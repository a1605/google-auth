import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DocumentService } from 'src/document/document.service';
import { Document } from 'src/document/document.entity';
import { GoogleStrategy } from 'src/auth/middleware/google.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User, Document]),
  ],
  controllers: [UserController],
  providers: [GoogleStrategy, UserService, DocumentService],
})
export class UserModule {}
