import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UploadDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
