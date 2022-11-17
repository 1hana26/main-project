import { Field, InputType } from "@nestjs/graphql";
import { printType } from "graphql";
import { NationImageInput } from "src/apis/nationImages/dto/nationImage.inpu";

@InputType()
export class CreateNationalityInput {
  @Field(() => String)
  name: string;

  @Field(() => NationImageInput)
  nationImage: NationImageInput;
}
