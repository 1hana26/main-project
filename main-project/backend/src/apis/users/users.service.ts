import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Nationality } from "../nationalities/entities/nationality.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Nationality)
    private readonly nationalityRepository: Repository<Nationality>
  ) {}

  //사용자 목록 조회
  async findAll() {
    return await this.userRepository.find({
      relations: ["nationality", "nationality.image"],
    });
  }

  //사용자 조회
  async findOne({ email }) {
    return await this.userRepository.findOne({
      where: { email: email },
      relations: ["nationality", "nationality.image"],
    });
  }

  //삭제된 사용자까지 목록 조회
  async findWithDeleted() {
    return await this.userRepository.find({
      withDeleted: true,
      relations: ["nationality", "nationality.image"],
    });
  }

  //사용자 데이터 생성
  async create({ hashedPassword: password, ...createUserInput }) {
    //예외처리를 위한 과정
    //만약 DB에 중복된 아이디가 있으면 생성불가능 (예외처리)
    const preUser = await this.userRepository.findOne({
      where: { id: createUserInput.id },
    });

    if (preUser) throw new ConflictException("이미 등록된 아이디 입니다.");

    //사용자 회원가입
    // const { nationalityId, ...user } = createUserInput;
    const temp = { ...createUserInput };

    const result = await this.userRepository.save({
      ...createUserInput,
      nickname: createUserInput.id,
      nationality: { nationality_id: createUserInput.nationalityId },
      password,
    });

    return result;
  }

  // 사용자 데이터 업데이트
  async update({ userId, updateUserInput }) {
    const preUser = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    const result = this.userRepository.save({
      ...preUser,
      user_id: userId,
      ...updateUserInput,
    });
    return result;
  }

  async updatePwd({ userId, password }) {
    // 수정후 결과값까지 받을때 사용
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    const result = this.userRepository.save({
      ...user,
      user_id: userId,
      password,
    });
    return result;
  }

  //데이터 수정 전 삭제된 유저의 데이터인지 확인.
  async checkDeleted({ userId }) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (user.deletedAt !== null)
      throw new UnprocessableEntityException("삭제된 유저입니다.");
  }

  //데이터 삭제
  async delete({ userId }) {
    const result = await this.userRepository.softDelete({
      user_id: userId,
    });
    return result.affected ? true : false;
  }

  //데이터 복구
  async restore({ userId }) {
    const result = await this.userRepository.restore({
      user_id: userId,
    });
    return result.affected ? true : false;
  }
}
