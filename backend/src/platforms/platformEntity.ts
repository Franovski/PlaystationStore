import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  platformId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  platformName: string;
}