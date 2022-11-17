import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Preference {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  preference_id: string;

  @Column({ type: "varchar", length: 100 })
  @Field(() => String)
  name: string;
}
