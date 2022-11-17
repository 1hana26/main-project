import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/entities/product.entity";
import { ImagesResolver } from "./images.resolver";
import { ImagesService } from "./images.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
    ]),
  ],
  providers: [
    ImagesResolver, //
    ImagesService,
  ],
})
export class ImagesModule {}
