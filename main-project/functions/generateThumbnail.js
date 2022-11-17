//배포 실패하면, 이전코드로 되돌아옴.따라서 놀라지 말것.
//cloud storage에 새로운 파일이 생성되는 이벤트 발생시 트리거.
//Storage를 새로생성(new)해서 storage를 사용하기 위한 값들을 넣어줘야하는데,
//해당 Storage를 사용하기 위해서는 import { Storage } from "@google-cloud/storage"를 사용해줘야함.
//package.json에서 type:"module"을 추가하고 import를 사용해봤는데 읽어올 수 없다는 에러가 떴다.
//따라서 require를 사용해서 불러왔다.
const { Storage } = require("@google-cloud/storage");
//import { Storage } from "@google-cloud/storage";는 적용되지 않음.
//storage 버전을 낮춰보니까 오류가 사라짐.. 버전 확인 잘하기..!
//사진을 사르기 위한 라이브러리 sharp도 동일한 방법으로 불러왔다.
const sharp = require("sharp");

exports.ThumbnailTriggered = async (event, context) => {
  //뭐가 들어오는지 모르니까 일단 다 console.log()로 보기
  console.log("========"); //구분선
  console.log(event);
  //event에 들어오는 정보 중에 name에 이미지 파일이름이 들어오고, bucket에 나의 버켓이름이 들어옴.
  //객체로 들어오니까 .을 사용해서 이용할 수 있다고 생각.
  console.log(event.name);
  //실험삼아 event.name을 콘솔로 찍어봄.->여기서 파일 이름이 찍히는걸 볼 수 있었음.
  console.log("========"); //구분선

  if (event.name.includes("thumb/")) return;
  //만약에 map에 의해 폴더안에 이미지가 생성되었으면, 이미지의 이름에 폴더의 이름이 들어가게 된다.
  //따라서 만약에 파일이름에 thumb가 포함되어 있다면 이미 생성된 이미지이기 때문에 더이상의 생성을 막기위해서 return을 실행
  //위의 코드 한줄이 폴더에 폴더에 폴더가 생성되는걸 방지,, 무한생성되서 큰일날뻔했다.(thumb안에 thumb안에 또 안에,,안에,,안에,, 이렇게 230개 생성될뻔,,)

  const size = {
    s: 320,
    m: 640,
    l: 1280,
  };
  const sizeNameArr = Object.keys(size);
  //사이즈(s,m,l)이 담긴 배열이 들어옴 ['s','m','l']
  //사이즈에 해당하는 width를 가져오려면 size[sizeName]

  //const size = 320
  //1단계 넓이 320으로 새로 만들기
  //3단계 넓이 320,640,1280으로 만들기

  const storage = new Storage().bucket(event.bucket);
  //스토리지 생성 이때, new를 통해서 새로운게 생성되니까 초기화됨.
  //이전 수업시간 실습 때,new Storage를 하면서 projectId,KeyFilename을 입력해줬는데
  //입력해 주지 않아도 되는 이유가 궁금했는데 구글 클라우드 플렛폼 파이프라인을 보니 이해가됬다.
  //const storage = new Storage를 통해서 파일이 올라갈 위치가 담기게 됨
  //.bucket은 gcp cloud storage에서 업로드된 파일이 저장될 버킷이름. 즉, 여기서는 내가올린 버킷
  //원래는 ""안에 내 버킷이름을 적어놨는데 event에 들어오는 버킷이름을 가져와서 사용

  //3단계&4단계를 구현한 코드
  await Promise.all(
    sizeNameArr.map((sizeName) => {
      //ele 에는 's','m','l'가 순서대로 들어옴.
      return new Promise(() => {
        //.으로 연결되는 건 위의 결과에서 .file을 쓰고 위의 결과에서 .~를 쓰고를 의미.
        storage
          .file(event.name) //내가 업로드한 버킷에서 event에 들어온 name을 가진 파일의 이름을 가져와서
          .createReadStream() //내스토리지에서 해당 파일 이름인 이미지 파일을 Stream으로 읽어서 정보를 가져오고
          .pipe(sharp().resize({ width: size[sizeName] })) //가져온 정보를 sharp를 이용해서 다시만드는데 넓이는 size로 해줘
          .pipe(
            storage.file(`thumb/${sizeName}/${event.name}`).createWriteStream()
          );
        //이걸 새로운 파일 thumb를 만들고 파일에 createWriteStream()으로 스토리지에 올려주기.
        //   .on("finish", () => resolve("성공")) //성공하면 resolve
        //   .on("error", () => reject("실패")); //실패하면 reject
        //-> 리턴할때 해당값으로 들어오는데 이 함수는 파일을 새로만들어서 저장하는 함수기 때문에 리턴이 필요 없다.
      });
    })
  );

  //1단계에서 실행한 코드
  //Promise가 함수가 아니라는 에러 => Promise에 new를 안적어줘서,, 꼭 적어주자.
  // const result =  await new Promise((resolve,reject)=>{
  //   //.으로 연결되는 건 위의 결과에서 .file을 쓰고 위의 결과에서 .~를 쓰고를 의미.
  //   storage
  //   .file(event.name)//내가 업로드한 버킷에서 event에 들어온 name을 가진 파일의 이름을 가져와서
  //   .createReadStream()//내스토리지에서 해당 파일 이름인 이미지 파일을 Stream으로 읽어서 정보를 가져오고
  //   .pipe(sharp().resize({width:size}))//가져온 정보를 sharp를 이용해서 다시만드는데 넓이는 size로 해줘
  //   .pipe(storage.file(`thumb/${event.name}`).createWriteStream())//이걸 새로운 파일 thumb를 만들고 파일에 createWriteStream()으로 스토리지에 올려주기.
  //   .on("finish",()=>resolve())//성공하면 resolve
  //   .on("error",()=>reject())//실패하면 reject
  // })
  //   return result;
};
