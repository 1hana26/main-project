import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ImagesService } from "./images.service";

@Resolver()
export class ImagesResolver {
  constructor(
    private readonly imagesService: ImagesService //
  ) {}
}
