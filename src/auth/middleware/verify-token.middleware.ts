import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: Function) {
    try {
      var token = '';
      if (req.headers.authorization) {
        token = req.headers.authorization;
        token = token.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decodedToken) {
          req['userId'] = decodedToken.userId;
          next();
        }
      }
    } catch (err) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
  }
}
