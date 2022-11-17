import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class updatePreferenceInput {
  @Field(() => String)
  name: string;
}
