import { InputType, PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "./createUser.input";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  //nickname 넣으려면 nullAble 값 지정 해놓고 하기
}
