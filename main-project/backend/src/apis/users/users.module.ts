import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAccessStrategy } from "src/commons/auth/jwt-access.strategy";
import { Nationality } from "../nationalities/entities/nationality.entity";
import { User } from "./entities/user.entity";
import { UserResolver } from "./users.resolver";
import { UserService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Nationality, //
    ]),
  ],
  providers: [
    UserResolver, //
    UserService,
  ],
})
export class UserModule {}
