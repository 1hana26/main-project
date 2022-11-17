import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Cache } from "cache-manager";
import { CACHE_MANAGER, Inject, UnauthorizedException } from "@nestjs/common";

export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache //
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "myAccessKey",
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    console.log(req);
    console.log(payload);
    const aaa = req.headers.authorization;
    console.log(aaa);
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    //redis에 있는지 확인하기
    const isExist = await this.cacheManager.get(`accessToken:${accessToken}`);
    if (isExist) {
      throw new UnauthorizedException("이미 로그아웃 되었습니다.");
    }
    return {
      email: payload.email,
      user_id: payload.sub,
    };
  }
}
