import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Product } from "./entities/product.entity";
import { ProductService } from "./products.service";
import { CreateProductInput } from "./dto/createProduct.input";
import { UpdateProductInput } from "./dto/updateProduct.input";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Resolver()
export class ProductResolver {
  constructor(
    private readonly productService: ProductService, //
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  //데이터 목록 조회
  @Query(() => [Product])
  async fetchProducts(
    @Args({ name: "search", nullable: true }) search: string //
  ) {
    //1. redis에 해당 결과가 있는지 확인하기
    const productsCache = await this.cacheManager.get(`products:${search}`);
    console.log("===Redis===");
    console.log(productsCache);
    if (productsCache) {
      //2-1. redis에 결과가 있다면 redis에서 데이터 보내기~
      return productsCache;
    }
    //2-2. redis에 결과가 없다면 elastic에서 찾기
    //엘라스틱에서 검색어가 이름인 경우를 찾기
    const result = await this.elasticsearchService.search({
      index: "myproduct04444", //컬랙션을 index라 부름.
      query: {
        // match: { name: search },
        term: { name: search },
      },
    });
    //데이터 조작하기
    const data = result.hits.hits.map((row) => {
      console.log("===row===");
      console.log(row);
      return {
        product_id: row._source["product_id"],
        price: row._source["price"],
        name: row._source["name"],
      };
    });
    // console.log(JSON.stringify(result, null, "  "));

    //redis에 저장하기 ttl은 30초로 저장.
    await this.cacheManager.set(`products:${search}`, data, {
      ttl: 30,
    });

    return data;
    //이전 코드
    // return this.productService.findAll();
  }

  //데이터 개별 조회
  @Query(() => Product)
  fetchProduct(
    @Args("productId") productId: string //
  ) {
    return this.productService.findOne({ productId });
  }

  //삭제 데이터까지 전체 조회
  @Query(() => [Product])
  fetchProductsWithDeleted() {
    return this.productService.findWithDeleted();
  }

  //상품 데이터 추가
  @Mutation(() => Product)
  createProduct(
    @Args("createProductInput") createProductInput: CreateProductInput //
  ) {
    return this.productService.create({ createProductInput });
  }

  //데이터 업데이트
  @Mutation(() => Product)
  async updateProduct(
    @Args("productId") productId: string,
    @Args("updateProductInput") updateProductInput: UpdateProductInput
  ) {
    //판매완료가 되었는지 확인
    await this.productService.checkProduct({ productId });
    //수정하기
    return this.productService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args("productId") productId: string //
  ) {
    return this.productService.delete({ productId });
  }

  @Mutation(() => Boolean)
  restoreProduct(
    @Args("productId") productId: string //
  ) {
    return this.productService.restore({ productId });
  }
}
