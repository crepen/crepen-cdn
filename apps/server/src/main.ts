import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './config/filter/exception.filter';

async function bootstrap() {
  console.log('Run Port :' , process.env.GLOBAL_PORT)
  console.log('Run Node ENV : ' , process.env.NODE_ENV )
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      transform : true,
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter())


  await app.listen(process.env.GLOBAL_PORT || 3600);
}




bootstrap();
