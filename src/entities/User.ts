import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column()
  carModel!: string;
  
  @Column()
  yearsOfExperience!: number;
  
  @Column()
  quote!: number;
}
