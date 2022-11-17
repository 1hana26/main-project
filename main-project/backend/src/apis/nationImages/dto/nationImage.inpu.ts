import { InputType, OmitType } from "@nestjs/graphql";
import { NationImage } from "../entities/nationImage.entity";

@InputType()
export class NationImageInput extends OmitType(
  NationImage,
  ["nation_image_id"],
  InputType
) {
  //
}
