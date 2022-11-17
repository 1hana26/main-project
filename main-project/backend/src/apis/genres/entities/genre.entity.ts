import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/products/entities/product.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Genre {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  genre_id: string;

  @Column({ type: "varchar", length: 100 })
  @Field(() => String)
  name: string;

  @ManyToMany(() => Product, (product) => product.genre)
  @Field(() => [Product])
  product: Product[];
}
