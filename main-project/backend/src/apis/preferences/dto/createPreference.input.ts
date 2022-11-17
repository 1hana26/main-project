import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class createPreferenceInput {
  @Field(() => String)
  name: string;
}
