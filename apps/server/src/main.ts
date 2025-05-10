import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './config/filter/exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('server.port') || 3600;

  console.log('Server is running on port: ', port);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      transform : true,
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter())


  await app.listen(port);
}




void bootstrap();
