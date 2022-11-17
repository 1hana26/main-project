import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateNationalityInput } from "./createNationality.input";

@InputType()
export class UpdateNationalityInput extends PartialType(
  CreateNationalityInput
) {}
