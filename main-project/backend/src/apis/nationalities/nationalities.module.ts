import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NationImage } from "../nationImages/entities/nationImage.entity";
import { Nationality } from "./entities/nationality.entity";
import { NationalitiesResolver } from "./nationalities.resolver";
import { NationalitiesService } from "./nationalities.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nationality,
      NationImage, //
    ]),
  ],
  providers: [NationalitiesResolver, NationalitiesService],
})
export class NationalitiesModule {}
