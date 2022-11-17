import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { UserService } from "../users/users.service";
import { AuthsResolver } from "./auths.resolver";
import { AuthsService } from "./auths.service";
import { JwtModule } from "@nestjs/jwt";
import { Nationality } from "../nationalities/entities/nationality.entity";
import { JwtAccessStrategy } from "src/commons/auth/jwt-access.strategy";
import { JwtRefreshStrategy } from "src/commons/auth/jwt-refresh.strategy";
import { AuthsController } from "./auths.controller";
import { JwtGoogleStrategy } from "src/commons/auth/jwt-social-google.strategy";
import { JwtKaKaoStrategy } from "src/commons/auth/jwt-social-kakao.strategy";
import { JwtNaverStrategy } from "src/commons/auth/jwt-social-naver.strategy";

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User,
      Nationality, //
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtKaKaoStrategy,
    JwtNaverStrategy,
    AuthsResolver, //
    AuthsService,
    UserService,
  ],
  controllers: [
    AuthsController, //
  ],
})
export class AuthsModule {}
