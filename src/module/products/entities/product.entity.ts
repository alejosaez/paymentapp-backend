import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products') 
export class Product {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column()
  name: string; 
  @Column()
  description: string; 

  @Column()
  category: string; 

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; 
  @Column()
  stock: number; 

  @Column()
  imageUrl: string; 
}
