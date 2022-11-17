import { Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException) //nest에게 에러를 여기서 잡아줘라고 데코레이터로 알려주기.
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const message = exception.message;
    const status = exception.getStatus();

    console.log("========예외 발생==========");
    console.log("예외 메세지", message);
    console.log("예외 코드" + status);
    console.log("========     ==========");
  }
}
