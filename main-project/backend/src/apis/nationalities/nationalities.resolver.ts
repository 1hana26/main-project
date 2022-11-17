import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateNationalityInput } from "./dto/createNationality.input";
import { UpdateNationalityInput } from "./dto/updateNationality.input";
import { Nationality } from "./entities/nationality.entity";
import { NationalitiesService } from "./nationalities.service";

@Resolver()
export class NationalitiesResolver {
  constructor(
    private readonly nationalitiesService: NationalitiesService //
  ) {}

  @Query(() => [Nationality])
  fetchNationalities() {
    return this.nationalitiesService.findAll();
  }

  @Query(() => Nationality)
  fetchNationality(
    @Args("nationalityId") nationalityId: string //
  ) {
    return this.nationalitiesService.findOne({ nationalityId });
  }

  @Query(() => [Nationality])
  fetchNationalitiesWithDeleted() {
    return this.nationalitiesService.findWithDeleted();
  }

  @Mutation(() => Nationality)
  createNationality(
    @Args("createNationalityInput")
    createNationalityInput: CreateNationalityInput
  ) {
    return this.nationalitiesService.create({ createNationalityInput });
  }

  @Mutation(() => Nationality)
  updateNationality(
    @Args("nationalityId") nationalityId: string,
    @Args("updateNationalityInput")
    updateNationalityInput: UpdateNationalityInput
  ) {
    return this.nationalitiesService.update({
      nationalityId,
      updateNationalityInput,
    });
  }

  @Mutation(() => Boolean)
  deleteNationality(
    @Args("nationalityId") nationalityId: string //
  ) {
    return this.nationalitiesService.delete({ nationalityId });
  }

  @Mutation(() => Boolean)
  restoreNationality(
    @Args("nationalityId") nationalityId: string //
  ) {
    return this.nationalitiesService.restore({ nationalityId });
  }
}
