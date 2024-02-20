import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async googleLogin(req: any) {
    let newUser;
    if (!req.user) return 'No User found';
    try {
      const user = new User();
      user.email = req.user.email;
      user.name = req.user.firstName;
      user.pictureUrl = req.user.picture;
      const existingUser = await this.userRepository.find({
        where: { email: req.user.email },
      });
      if (!existingUser) newUser = await this.userRepository.save(user);
      else newUser = existingUser[0];

      const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      );
      newUser['token'] = token;
      return {
        message: 'Logged in successfully',
        data: newUser,
      };
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to log in',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
