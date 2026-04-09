import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  PLAYSTATION_USER = 'playstation_user',
}

export enum PasswordResetMethod {
  OTP = 'otp',
  LINK = 'link',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 255, default: '' })
  firstName: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PLAYSTATION_USER })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  totpSecret: string | null;

  @Column({ type: 'boolean', default: false })
  isTotpEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  passwordResetMethod: PasswordResetMethod | null;

  @Column({ type: 'integer', default: 0 })
  passwordResetAttempts: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
