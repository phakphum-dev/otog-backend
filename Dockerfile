FROM node:14-alpine As build

WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --frozen-lockfile

ENV NODE_ENV production

COPY . .

RUN yarn build

FROM build as prod-deps
# Prune unused dependencies
RUN npm prune --production

FROM node:14-alpine

USER node

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD node dist/main