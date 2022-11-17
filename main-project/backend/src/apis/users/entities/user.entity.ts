import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Nationality } from "src/apis/nationalities/entities/nationality.entity";
import { Product } from "src/apis/products/entities/product.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  user_id: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  @Field(() => String)
  id: string;

  @Column({ nullable: false })
  // @Field(() => String)
  password: string;

  //, default: "kkk"
  @Column({ type: "varchar", length: 100, nullable: true })
  @Field(() => String)
  nickname: string;

  @Column({ type: "char", length: 11, nullable: false })
  @Field(() => String)
  phone_number: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  @Field(() => String)
  email: string;

  @Column({ type: "int", unsigned: true, default: 0 })
  @Field(() => Int)
  cash: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinTable()
  @ManyToMany(() => Product, (product) => product.user)
  @Field(() => [Product])
  product: Product[];

  @JoinColumn()
  @ManyToOne(() => Nationality)
  @Field(() => Nationality)
  nationality: Nationality;
}
