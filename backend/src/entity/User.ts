import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    Unique,
    OneToMany,
    JoinColumn,
    OneToOne
} from "typeorm";
import { IsNotEmpty } from 'class-validator'
import * as bcrypt from 'bcryptjs'
import { Task } from './Task'
import { Profile } from "./Profile";

/* O decorator @JoinColumn() significa que a tabela que o herda é o dono da relação */

@Entity('user')
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Task, task => task.user, {
      cascade: true,
      eager: true
    })
    @JoinColumn({ name: 'id' })
    task: Task

    @OneToOne(type => Profile, profile => profile.user , {
      cascade: true,
      eager: true
    })
    @JoinColumn({ name: 'id' })
    profile: Profile

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    @IsNotEmpty()
    role: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
