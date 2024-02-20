import { Document } from 'src/document/document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  pictureUrl: string;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];
}
