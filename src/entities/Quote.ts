import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amount!: number;

  @ManyToOne(() => User, user => user.quote)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
