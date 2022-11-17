import { CACHE_MANAGER, Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Cache } from "cache-manager";

export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache //
  ) {
    super({
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace("refreshToken=", "");
        return refreshToken; //
      },
      secretOrKey: "myRefreshKey",
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    console.log("====refresh====");
    console.log(payload);
    console.log(req);
    const refreshToken = req.headers.cookie.replace("refreshToken=", "");
    const isExist = await this.cacheManager.get(`refreshToken:${refreshToken}`);

    if (isExist) throw new UnauthorizedException("이미 로그아웃 되었습니다.");
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
