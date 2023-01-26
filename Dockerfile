# Common build stage
FROM node:16-alpine as common-build-stage

ENV WORKDIR=/usr/src/app/ 

WORKDIR ${WORKDIR}

COPY  ./package.json ${WORKDIR}
COPY ./package-lock.json ${WORKDIR}

RUN npm ci

COPY . ${WORKDIR}

EXPOSE 3000


ENTRYPOINT [ "npm","run","start" ]

