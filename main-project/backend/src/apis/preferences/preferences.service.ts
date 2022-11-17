import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Preference } from "./entities/preference.entity";

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>
  ) {}

  //선호도 전체 조회
  async findAll() {
    return await this.preferenceRepository.find();
  }
  //선호도 아이디 조회-> 업데이트를 통해 수정할때 필요.
  async findOne(preferenceName) {
    return await this.preferenceRepository.findOne({
      where: { name: preferenceName },
    });
  }

  //선호도 생성
  async create({ createPreferenceInput }) {
    const result = await this.preferenceRepository.save({
      ...createPreferenceInput,
    });
    return result;
  }

  //선호도 업데이트

  async update({ preferenceId, updatePreferenceInput }) {
    //수정도하고 업데이트된 내용도 받는 방법.
    const preference = await this.preferenceRepository.findOne({
      where: { preference_id: preferenceId },
    });

    const result = this.preferenceRepository.save({
      ...preference, //기존의 데이터 불러오기
      preference_id: preferenceId,
      ...updatePreferenceInput, //같은 키를 가진 객체를 가져와 기존의 데이터를 덮어 쓰기
    });

    return result;
  }
  //예외상황 생각해서 코드 추가해보기.
}
