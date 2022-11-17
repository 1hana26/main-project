import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/users.service";
import { Cache } from "cache-manager";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id }, //
      { secret: "myRefreshKey", expiresIn: "2w" }
    );
    return res.setHeader(
      "Set-Cookie",
      `refreshToken=${refreshToken}; path=/; `
    );
  }

  getAccessToken({ user }) {
    //sign = 서명한다 의미, 토큰을 만든다
    return this.jwtService.sign(
      { email: user.email, sub: user.user_id }, //
      { secret: "myAccessKey", expiresIn: "1h" }
    );
  }

  async saveRedis({ accessToken, refreshToken }) {
    //accessToken을 저장, 1시간을 ttl으로 지정.
    await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
      ttl: 60 * 60,
    });

    //refreshToken을 저장, 2주로 ttl을 지정.
    await this.cacheManager.set(`refreshToken:${refreshToken}`, refreshToken, {
      ttl: 60 * 60 * 24 * 7 * 2, // 2주
    });
  }

  async socialLogin({ req, res }) {
    //1. 가입했는지 확인하기
    let user = await this.usersService.findOne({ email: req.user.email });

    //2. 회원가입하기 //비밀번호는 아무내용으로 생성, 따라서 구글로 로그인해서 접속만 가능, 비밀번호 접속하려면 비밀번호를 수정해주세요를 안내.
    if (!user)
      user = await this.usersService.create({
        ...req.user,
      });

    //3. 로그인하기(accessToken 만들어서 프론트 주기)
    this.setRefreshToken({ user, res });
    res.redirect(
      //redirect는 페이지를 전환하세요를 의미.
      "http://localhost:5500/homework/main-project/frontend/login/index.html"
    );
  }
}
