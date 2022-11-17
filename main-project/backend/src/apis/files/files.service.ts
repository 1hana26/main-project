import { Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FilesService {
  async upload({ files }) {
    //파일을 두개다 보냈는데 이것이 전달 될때까지 기다리기.
    //파일을 기다리지 않고 바로 콘솔에 찍은 경우
    // console.log(files);
    const waitedFiles = await Promise.all(files);
    //파일이 다 전달되기까지 기다리고 콘솔에 찍은 경우
    // console.log(waitedFiles); //[file, file]

    //스토리지 정보 가져오기
    const bucket = process.env.BUCKET;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_PROJECT_KEY_FILENAME,
    }).bucket(bucket);

    //파일 올리기
    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on("finish", () => resolve(`${bucket}/${el.filename}`))
              .on("error", () => reject("실패"));
          })
      )
    );
    return results; //성공하면 url, 실패하면 "실패"
  }
}
