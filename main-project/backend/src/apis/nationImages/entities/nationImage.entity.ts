import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class NationImage {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  nation_image_id: string;

  @Column({ type: "varchar", length: 200, nullable: false })
  @Field(() => String)
  url: string;
}
