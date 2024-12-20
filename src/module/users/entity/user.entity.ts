import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from 'src/module/cart/entities/cart.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password?: string;

  @OneToOne(() => Cart, (cart) => cart.user, { nullable: true, cascade: true })
  @JoinColumn()
  cart?: Cart;
}
