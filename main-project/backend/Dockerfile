FROM node:14

WORKDIR /myfolder/
COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
RUN yarn install
# 용량 많은걸 먼저 캐쉬에 넣어줘서 시간 효율 증가


COPY . /myfolder/
CMD yarn start:dev