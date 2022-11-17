import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Genre } from "../genres/entities/genre.entity";
import { Image } from "../images/entities/image.entity";
import { Preference } from "../preferences/entities/preference.entity";
import { System } from "../systems/entities/system.entity";
import { Product } from "./entities/product.entity";
import { ProductResolver } from "./products.resolver";
import { ProductService } from "./products.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Preference,
      Image,
      System,
      Genre, //
    ]),
    ElasticsearchModule.register({
      node: "http://elasticsearch:9200",
    }),
  ],
  providers: [
    ProductResolver, //
    ProductService,
  ],
})
export class ProductModule {}
