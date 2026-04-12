import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PlatformName {
  PS4 = 'ps4',
  PS5 = 'ps5',
}

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  platformId: number;

  @Column({ type: 'enum', enum: PlatformName, unique: true })
  platformName: PlatformName;
}
