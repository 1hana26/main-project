import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Genre } from "../genres/entities/genre.entity";
import { Image } from "../images/entities/image.entity";
import { Preference } from "../preferences/entities/preference.entity";
import { System } from "../systems/entities/system.entity";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {}

  async findAll() {
    return await this.productRepository.find({
      relations: ["image", "preference", "genre", "system"],
    });
  }

  async findOne({ productId }) {
    //하나만 찾아오기 위해서 조건이 필요
    return await this.productRepository.findOne({
      where: { product_id: productId },
      relations: ["preference", "genre", "system"],
    });
  }

  async findWithDeleted() {
    return await this.productRepository.find({
      withDeleted: true,
      relations: ["preference", "genre", "system"],
    });
  }

  async create({ createProductInput }) {
    //들어오는 데이터 구조분해 할당. rest연산자 사용
    const { image, productPreferenceId, gameSystem, gameGenre, ...product } =
      createProductInput;

    //many-to-many 데이터 저장
    //system
    //["window","macOS","VR"]
    const system = [];
    for (let i = 0; i < gameSystem.length; i++) {
      //기존 데이터가 있는지 확인하기
      const tempSystem = await this.systemRepository.findOne({
        where: { name: gameSystem[i] },
      });
      //기존데이터 유무에 따른 처리
      if (tempSystem) {
        system.push(tempSystem); //push->resolve
      } else {
        const newSystem = await this.systemRepository.save({
          name: gameSystem[i],
        });
        system.push(newSystem);
      }
    }

    //genre ->promise로 바꾸기,,, 그래야 하나,,?
    // const genre = [];
    //genre
    const genre = [];
    for (let i = 0; i < gameGenre.length; i++) {
      //기존 데이터 확인하기
      const tempGenre = await this.genreRepository.findOne({
        where: { name: gameGenre[i] },
      });

      if (tempGenre) {
        genre.push(tempGenre);
      } else {
        const newGenre = await this.genreRepository.save({
          name: gameGenre[i],
        });
        genre.push(newGenre);
      }
    }

    //선호도 이름을 받고 해당 아이디 찾아오기.
    const preference = await this.preferenceRepository.findOne({
      where: { preference_id: productPreferenceId },
    });

    //상품 테이블에 이미지id와 상품 정보, 선호도 id,장르, 운영체제 입력
    //키값과 벨류값이 같아서 벨류값 생략 (shorthand property)
    const result = await this.productRepository.save({
      ...product,

      preference,
      system,
      genre,
    });

    //one-to-many이미지 저장하기
    await Promise.all(
      image.map((ele: string) => {
        new Promise(async (resolve) => {
          const newImage = await this.imageRepository.save({
            url: ele,
            product: { product_id: result.product_id },
          });
          resolve(newImage);
        });
      })
    );
    // //one-to-many 이미지 저장
    // await this.imageRepository.save({
    //   product: result,
    //   ...image,
    // });

    return result;
  }

  async update({ productId, updateProductInput }) {
    //수정도하고 업데이트된 내용도 받는 방법.
    //상품아이디에 해당하는 상품 정보 찾기.
    const myproduct = await this.productRepository.findOne({
      where: { product_id: productId },
      relations: ["preference", "genre", "system"],
    });

    await this.imageRepository.delete({
      product: { product_id: myproduct.product_id },
    });

    //똑같은 url 중복 생성 방지.
    const isExistence = await this.imageRepository.findOne({
      where: { url: updateProductInput.productImage.url },
    });

    if (isExistence!) {
      throw new ConflictException("이미 생성된이미지 입니다.");
    }
    // 이미지 새로 저장하기
    const image = await this.imageRepository.save({
      // image_id: myproduct.image.image_id, 이거 쓰면 업데이트,,
      url: updateProductInput.productImage.url,
      product: { product_id: myproduct.product_id },
    });

    const result = this.productRepository.save({
      ...myproduct, //마지막이 기존의 데이터를 덮어 쓰기 때문에 괜찮다.
      product_id: productId,
      ...updateProductInput,
      image,
    });
    return result;
  }

  async checkProduct({ productId }) {
    const product = await this.productRepository.findOne({
      where: { product_id: productId },
    });

    if (!product) {
      throw new ConflictException("해당 상품 정보가 없습니다.");
    }

    // !product.isExistence
    if (product.deletedAt !== null)
      throw new UnprocessableEntityException("삭제된 상품입니다.");
  }

  async delete({ productId }) {
    const result = await this.productRepository.softDelete({
      product_id: productId,
    });
    return result.affected ? true : false;
  }

  async restore({ productId }) {
    const result = await this.productRepository.restore({
      product_id: productId,
    });
    return result.affected ? true : false;
  }
}
