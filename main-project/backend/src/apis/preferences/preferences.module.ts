import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Preference } from "./entities/preference.entity";
import { PreferencesResolver } from "./preferences.resolver";
import { PreferencesService } from "./preferences.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Preference, //
    ]),
  ],
  providers: [PreferencesResolver, PreferencesService],
})
export class PreferencesModule {}
