import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NationImage } from "../nationImages/entities/nationImage.entity";
import { Nationality } from "./entities/nationality.entity";

@Injectable()
export class NationalitiesService {
  constructor(
    @InjectRepository(Nationality)
    private readonly nationalityRepository: Repository<Nationality>,
    @InjectRepository(NationImage)
    private readonly nationalityImageRepository: Repository<NationImage>
  ) {}

  //국적 전체 조회
  async findAll() {
    return await this.nationalityRepository.find({
      relations: ["image"],
    });
  }
  //국적 조회-> 업데이트를 통해 수정할때 필요.
  async findOne({ nationalityId }) {
    return await this.nationalityRepository.findOne({
      where: { nationality_id: nationalityId },
      relations: ["image"],
    });
  }

  async findWithDeleted() {
    return await this.nationalityRepository.find({
      withDeleted: true,
      relations: ["image"],
    });
  }

  //국적 생성
  async create({ createNationalityInput }) {
    const { nationImage, ...nationality } = createNationalityInput;

    const image = await this.nationalityImageRepository.save({
      ...nationImage,
    });

    const result = await this.nationalityRepository.save({
      ...nationality,
      image: image,
    });
    return result;
  }

  //국적 업데이트

  async update({ nationalityId, updateNationalityInput }) {
    //수정도하고 업데이트된 내용도 받는 방법.
    const preNationality = await this.nationalityRepository.findOne({
      where: { nationality_id: nationalityId },
    });

    const result = this.nationalityRepository.save({
      ...preNationality, //기존의 데이터 불러오기
      nationality_id: nationalityId,
      ...updateNationalityInput, //같은 키를 가진 객체를 가져와 기존의 데이터를 덮어 쓰기
    });

    return result;
  }
  //예외상황 생각해서 코드 추가해보기.

  async delete({ nationalityId }) {
    const result = await this.nationalityRepository.softDelete({
      nationality_id: nationalityId,
    });
    return result.affected ? true : false;
  }

  async restore({ nationalityId }) {
    const result = await this.nationalityRepository.restore({
      nationality_id: nationalityId,
    });
    return result.affected ? true : false;
  }
}
