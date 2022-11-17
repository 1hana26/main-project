import { Field, InputType, Int } from "@nestjs/graphql";
import { Min } from "class-validator";
import { ImageInput } from "src/apis/images/dto/image.input";

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  // @Field(() => ImageInput)
  // image: ImageInput;

  @Field(() => [String])
  image: string[];

  @Field(() => String)
  productPreferenceId: string;

  @Field(() => [String])
  gameSystem: string[];

  @Field(() => [String])
  gameGenre: string[];
}
