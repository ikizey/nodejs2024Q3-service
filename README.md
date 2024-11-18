# Home Library Service


## Running application

add .env file to root folder (use .env.example as example)

```
cp .env.example .env
```

install dependencies
```
npm install
```

create database folder

```
mkdir database
```

run docker compose
```
docker compose up
```

setup prisma
```
npm run prisma:generate
npm run prisma:migrate
```

## API documentation

http://localhost:4000/doc (by default) or http://localhost:PORT/doc where PORT is your port number from .env file


## Tests

```
npm run test
```

## Run lint

```
npm run lint
```
