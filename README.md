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
docker-compose up --build
```
then Ctrl+C to stop docker compose

### setup prisma

in .env file change POSTGRES_HOST to localhost

```
docker-compose up postgres
```

setup prisma (only once) (in another terminal)
```
npm run prisma:generate
npm run prisma:migrate
```

back to main terminal 
Ctrl+C to stop docker compose

in .env file change POSTGRES_HOST back to postgres

now everything is set up and you can run the app

```
docker-compose up
```

## Trouble shooting
if during build you have an error about database folder, just delete database/data folder and follow instructions above again
you need administrator rights to delete database folder
for example in terminal
```
sudo rm -r database/data
```
(for windows you can delete database/data folder in file explorer)

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
