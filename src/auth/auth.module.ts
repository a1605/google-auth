import { Module } from '@nestjs/common';
import { GoogleStrategy } from './middleware/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity.';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User]),
  ],

  providers: [GoogleStrategy],
})
export class GoogleAuthModule {}
