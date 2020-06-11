import { 
  PrimaryGeneratedColumn, 
  Entity, 
  Column,
  OneToOne
} from "typeorm";
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
  zip_code: string;

  @OneToOne(type => User, user => user.profile)
  user: User
}