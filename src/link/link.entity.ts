import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  maskKey: string;

  @Column()
  originalUrl: string;

  @Column()
  maskedLink: string;

  @Column({ default: 0 })
  redirectCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true }) // Permitir que el campo sea nulo si no se especifica la contraseña
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;
}
