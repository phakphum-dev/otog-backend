FROM node:14-alpine As build

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:14-alpine as production

WORKDIR /usr/src/app

COPY --from=build //usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD yarn start:prod