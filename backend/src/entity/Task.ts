/* eslint-disable camelcase */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { User } from './User'

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => User, user => user.task)
  user: User

  @Column()
  title: string

  @Column()
  description: string

  @Column({ default: false })
  finished: Boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
