import {
  // HttpException,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import { GqlAuthRefreshGuard } from "src/commons/auth/gql-auth.guard";
import { IContext } from "src/commons/type/context";
import { UserService } from "../users/users.service";
import { AuthsService } from "./auths.service";
import * as jwt from "jsonwebtoken";

@Resolver()
export class AuthsResolver {
  constructor(
    private readonly usersService: UserService,
    private readonly authsService: AuthsService //
  ) {}

  @Mutation(() => String)
  async login(
    @Args("email") email: string, //
    @Args("password") password: string,
    @Context() context: IContext
  ) {
    // 1. 로그인 (아이디가 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findOne({ email });

    // 2. 일치하는 유저가 없으면 (사용자의 잘못된 입력) 에러 던지기
    if (!user) {
      throw new UnprocessableEntityException("입력하신 이메일이 없습니다.");
    }

    // 3. 일치하는 유저가 있지만 (사용자가 입력한) 비밀번호가 틀리다면 에러던지기
    //비밀번호가 맞는지 틀리는지를 bcrypt를 사용해서 확인하기.
    const isAuth = await bcrypt.compare(password, user.password);

    //비밀번호가 틀리다면 에러던지기
    if (!isAuth) {
      throw new UnprocessableEntityException("비밀번호가 틀렸습니다.");
    }
    //4. refreshToken 생성하기
    this.authsService.setRefreshToken({ user, res: context.res });

    // 5. 일치하는 유저있고 비밀번호 맞으면 accessToken인  JWT 토큰 브라우저에 전달
    // 브라우저는 알아서 브라우저 저장소에 저장함.
    return this.authsService.getAccessToken({ user });
  }

  @Mutation(() => String)
  logout(
    @Context() context: any //
  ) {
    const headers = JSON.parse(JSON.stringify(context.req.headers));
    const accessToken = headers.authorization.replace("Bearer ", "");
    // console.log(accessToken);
    const refreshToken = headers.cookie.replace("refreshToken=", "");
    // console.log(refreshToken);

    //토큰 검증하기
    try {
      jwt.verify(accessToken, "myAccessKey");
      jwt.verify(refreshToken, "myRefreshKey");
    } catch (error) {
      //검증시 오류 발생 = 검증 실패 따라서 에러메시지 발생하기
      throw new UnauthorizedException();
    }

    //redis에 저장하기
    this.authsService.saveRedis({ accessToken, refreshToken });
    return "로그아웃에 성공했습니다";
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }
}
