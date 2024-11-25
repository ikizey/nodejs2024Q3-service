import { readFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as yaml from 'js-yaml';

const port = +process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const api = yaml.load(
    readFileSync('./doc/api.yaml', 'utf8'),
  ) as OpenAPIObject;
  SwaggerModule.setup('doc', app, api);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, strictGroups: true }),
  );

  await app.listen(port);
}
bootstrap();
