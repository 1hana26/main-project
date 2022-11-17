import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Genre } from "src/apis/genres/entities/genre.entity";
import { Image } from "src/apis/images/entities/image.entity";
import { Preference } from "src/apis/preferences/entities/preference.entity";
import { System } from "src/apis/systems/entities/system.entity";
import { User } from "src/apis/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  product_id: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  @Field(() => String)
  name: string;

  @Column({ type: "int", unsigned: true })
  @Field(() => Int)
  price: number;

  @Column({ default: true })
  @Field(() => Boolean)
  isExistence: Boolean;

  @CreateDateColumn()
  @Field(() => Date)
  date: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @JoinColumn()
  // @Field(() => Image)
  // @OneToOne(() => Image)
  // image: Image;

  @Field(() => Preference)
  @ManyToOne(() => Preference)
  preference: Preference;

  @JoinTable()
  @Field(() => [Genre])
  @ManyToMany(() => Genre, (genre) => genre.product)
  genre: Genre[];

  @JoinTable()
  @Field(() => [System])
  @ManyToMany(() => System, (system) => system.product)
  system: System[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.product)
  user: User[];
}
