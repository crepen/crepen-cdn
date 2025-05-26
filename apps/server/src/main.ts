import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ArgumentsHost, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationException, I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { BaseResponse } from './common/base-response';
import { ExceptionResponseFilter } from './common/filter/ex.response.filter';
import { BootService } from './lib/services/boot.service';

async function bootstrap() {

  BootService.instance()
    .setInitConfig()

  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('server.port') || 3600;

  console.log('Server is running on port: ', port);


  app.useGlobalPipes(

    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),

  )



  // const i18n = app.get<I18nService<Record<string, unknown>>>(I18nService);
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: true,
    responseBodyFormatter: (host: ArgumentsHost, exc: I18nValidationException, formattedErrors: object) => {
      console.log('EYA', exc.errors[0].constraints)
      // Object.values(exc.errors[0].constraints)[0]
      return BaseResponse.error(exc.getStatus(), Object.values(exc.errors[0].constraints)[0]);
    }
  }));
  app.useGlobalFilters(new ExceptionResponseFilter());


  //#region Swagger

  const options = new DocumentBuilder()
    .setTitle('Crepen CDN API Server')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Token',
      in: 'header'
    }, 'token')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  //#endregion Swagger

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // app.use(express.urlencoded({ extended : true }));
  // app.use(express.json());



  await app.listen(port);
}




void bootstrap();
