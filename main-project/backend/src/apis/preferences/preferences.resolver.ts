import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { createPreferenceInput } from "./dto/createPreference.input";
import { updatePreferenceInput } from "./dto/updatePreference.input";
import { Preference } from "./entities/preference.entity";
import { PreferencesService } from "./preferences.service";

@Resolver()
export class PreferencesResolver {
  constructor(
    private readonly preferencesService: PreferencesService //
  ) {}

  @Query(() => [Preference])
  fetchPreferences() {
    return this.preferencesService.findAll();
  }

  @Query(() => Preference)
  fetchPreference(
    @Args("preferenceName") preferenceName: string //
  ) {
    return this.preferencesService.findOne(preferenceName);
  }

  @Mutation(() => Preference)
  createPreference(
    @Args("createPreferenceInput") createPreferenceInput: createPreferenceInput
  ) {
    return this.preferencesService.create({ createPreferenceInput });
  }

  @Mutation(() => Preference)
  updatePreference(
    @Args("preferenceId") preferenceId: string,
    @Args("updatePreferenceInput") updatePreferenceInput: updatePreferenceInput
  ) {
    return this.preferencesService.update({
      preferenceId,
      updatePreferenceInput,
    });
  }
}
