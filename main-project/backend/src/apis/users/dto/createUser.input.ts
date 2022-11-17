import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone_number: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  nationalityId: string;
}
