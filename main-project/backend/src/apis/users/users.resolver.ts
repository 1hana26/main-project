import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserInput } from "./dto/createUser.input";
import { UpdateUserInput } from "./dto/updateUser.input";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";
import * as bcrypt from "bcrypt";
import { UseGuards } from "@nestjs/common";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService //
  ) {}

  //전체 사용자 목록 조회
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  //사용자 세부 정보 조회
  @Query(() => User)
  fetchUser(
    @Args("email") email: string //
  ) {
    return this.userService.findOne({ email });
  }

  //삭제된 사용자 데이터를 포함한 전체 사용자 조회
  @Query(() => [User])
  fetchUsersWithDeleted() {
    return this.userService.findWithDeleted();
  }

  //로그인한 user한 사람을 조회
  @Query(() => User)
  @UseGuards(GqlAuthAccessGuard)
  fetchLoginUser(
    @Context() context: any //
  ) {
    const email = context.req.user.email;
    return this.userService.findOne({ email });
  }

  //사용자 생성
  @Mutation(() => User)
  async createUser(
    @Args("createUserInput") createUserInput: CreateUserInput //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 11);
    console.log(hashedPassword + "해쉬비밀번호");
    return this.userService.create({ hashedPassword, ...createUserInput });
  }

  //사용자 정보 업데이트
  @Mutation(() => User)
  async updateUser(
    @Args("userId") userId: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput //
  ) {
    //데이터 업데이트전 사용자 정보가 삭제된 정보인지 확인
    await this.userService.checkDeleted({ userId });
    //사용자 정보 업데이트
    return this.userService.update({ userId, updateUserInput });
  }

  //로그인한 user의 비밀번호 변경
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Context() context: any, //
    @Args("newPassword") newPassword: string
  ) {
    const userId = context.req.user.id;
    const password = await bcrypt.hash(newPassword, 11);

    return this.userService.updatePwd({ userId, password });
  }

  //사용자 데이터 삭제
  @Mutation(() => Boolean)
  deleteUser(
    @Args("userId") userId: string //
  ) {
    return this.userService.delete({ userId });
  }

  //로그인한 user의 정보 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(
    @Context() context: any //
  ) {
    const userId = context.req.user.id;
    return this.userService.delete({ userId });
  }

  //삭제한 사용자 데이터 복구
  @Mutation(() => Boolean)
  restoreUser(
    @Args("userId") userId: string //
  ) {
    return this.userService.restore({ userId });
  }
}
