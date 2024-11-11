import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const api = yaml.load(
    readFileSync('./doc/api.yaml', 'utf8'),
  ) as OpenAPIObject;
  SwaggerModule.setup('doc', app, api);
  await app.listen(4000);
}
bootstrap();
