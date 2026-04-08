import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  gameId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  developer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ageRating: string;
}