import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ProductModule } from "./apis/products/products.module";
import { PreferencesModule } from "./apis/preferences/preferences.module";
import { UserModule } from "./apis/users/users.module";
import { NationalitiesModule } from "./apis/nationalities/nationalities.module";
import { PaymentModule } from "./apis/payments/payments.module";
import { AuthsModule } from "./apis/auths/auths.module";
import { FilesModule } from "./apis/files/files.module";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthsModule,
    FilesModule,
    UserModule,
    PaymentModule,
    ProductModule,
    PreferencesModule,
    NationalitiesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "src/commons/graphql/schema.gql",
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + "/apis/**/*.entity.*"], // ** 폴더 안에서 뒤에 내용 찾기, ts에서 js로 바뀌기에 마지막에 *
      synchronize: true,
      logging: true, //ORM으로 부터 어떻게 mySQL에 명령어가 변경되어서 들어가는지
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: "redis://my-redis:6379",
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
