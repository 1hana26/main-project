import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/products/entities/product.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Image {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  image_id: string;

  @Column({ type: "varchar", nullable: false })
  @Field(() => String)
  url: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;
}
