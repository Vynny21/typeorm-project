/* eslint-disable camelcase */
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User'

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: number;

  @Column()
  whatsapp: number;

  @Column()
  address: string;

  @Column()
  zipcode: string;

  @OneToOne(type => User, user => user.profile)
  user: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
