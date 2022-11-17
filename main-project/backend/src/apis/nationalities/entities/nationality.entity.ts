import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { NationImage } from "src/apis/nationImages/entities/nationImage.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum NATIONALITY_DEFAULT {
  KOREA = "korea",
  JAPAN = "japan",
  USA = "usa",
  CHINA = "china",
}

registerEnumType(NATIONALITY_DEFAULT, {
  name: "NATIONALITY_DEFAULT",
});

@ObjectType()
@Entity()
export class Nationality {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  nationality_id: string;

  @Column({ type: "enum", enum: NATIONALITY_DEFAULT })
  @Field(() => NATIONALITY_DEFAULT)
  name: string;

  @JoinColumn()
  @OneToOne(() => NationImage)
  @Field(() => NationImage)
  image: NationImage;
}
