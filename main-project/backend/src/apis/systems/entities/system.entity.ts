import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/products/entities/product.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

@ObjectType()
@Entity()
export class System {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  system_id: string;

  @Column({ type: "varchar", length: 100 })
  @Field(() => String)
  name: string;

  @ManyToMany(() => Product, (product) => product.system)
  @Field(() => [Product])
  product: Product[];
}
