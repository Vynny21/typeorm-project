/* eslint-disable camelcase */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne
} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Task } from './Task'
import { Profile } from './Profile'

/* O decorator @JoinColumn() significa que a tabela que o herda é o dono da relação */

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    role: string

    @Column()
    @CreateDateColumn()
    created_at: Date;

    @Column()
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Task, (task) => task.user, {
      cascade: true,
      eager: true
    })
    @JoinColumn({ name: 'id' })
    public task: Task[]

    @OneToOne(() => Profile, (profile) => profile.user, {
      cascade: true,
      eager: true
    })
    @JoinColumn({ name: 'id' })
    public profile: Profile

    hashPassword () {
      this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid (unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password)
    }
}
