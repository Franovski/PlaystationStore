import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  PLAYSTATION_USER = 'playstation_user',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

export enum PasswordResetMethod {
  OTP = 'otp',
  LINK = 'link',
}

registerEnumType(PasswordResetMethod, {
  name: 'PasswordResetMethod',
});

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  userId: string; // Ensure string for uuid

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  firstName: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  lastName: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Field()
  @Column({ type: 'date' })
  dateOfBirth: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PLAYSTATION_USER })
  role: UserRole;

  @Field()
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  totpSecret: string | null;

  @Field()
  @Column({ type: 'boolean', default: false })
  isTotpEnabled: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires: Date | null;

  @Field(() => PasswordResetMethod, { nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  passwordResetMethod: PasswordResetMethod | null;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  passwordResetAttempts: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
