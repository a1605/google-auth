import { User } from './../user/user.entity.';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DocumentService {
  constructor(
    private userService: UserService,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}
  async getDocumentsUploadedByUser(userId: number): Promise<Document[]> {
    try {
      const documents = await this.documentRepository
        .createQueryBuilder('document')
        .innerJoin('document.user', 'user')
        .where('user.id = :userId', { userId: userId })
        .getMany();
      return documents;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to get pdf files',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadDocument(name: string, url: string, userId: number) {
    try {
      const user = await this.userService.findUserById(userId);
      const document = new Document();
      document.filename = name;
      document.url = url;
      document.user = user;
      await this.documentRepository.save(document);
      return 'Pdf uploaded successfully';
    } catch (err) {
      if (err.status) {
        throw err;
      }
      throw new HttpException(
        'Failed to upload pdf',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
