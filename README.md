# bookz
Simple example - book collection REST api. CRUD on Books & Authors entities (many to many association).

## used technologies/languages
- node
- express FW
- typescript
- javascript es2017 (mostly transpiled from TS)
- sequelize ORM (+ cli for migrations)
- MySQL (MariaDB) database
- mocha & chai for tests
- JSON schema for validating inputs (ajv package)
- bearer token authorization

## how to run
- build: `npm run build`
- build & start: `npm run start`
- dev start (with ts-node): `npm run dev:start`
- dev watch: `npm run dev:watch`
- tests: `npm run test`
- clean: `npm run clean`

## prebuild requirements
- copy required .env.* file to .env
- install packages..
