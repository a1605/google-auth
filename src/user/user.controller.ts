import {
  Controller,
  UseGuards,
  Req,
  Get,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { DocumentService } from 'src/document/document.service';
import * as session from 'express-session';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { UploadDocumentDto } from 'src/document/dto/upload-document.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private documentService: DocumentService,
  ) {}
  @Get('login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req);
  }

  @Get('logout')
  async logout(@Req() req, @Res() res) {
    req.session.destroy();
    res.redirect('/');
  }

  @Get('documents')
  async getAlltheDocuments(@Req() req) {
    const userId = req.userId;

    return this.documentService.getDocumentsUploadedByUser(userId);
  }
  @Post('upload')
  async uploadDocument(
    @Body() uploadDocumentDto: UploadDocumentDto,
    @Req() req,
  ) {
    const userId = req.userId;
    return this.documentService.uploadDocument(
      uploadDocumentDto.name,
      uploadDocumentDto.url,
      userId,
    );
  }
}
