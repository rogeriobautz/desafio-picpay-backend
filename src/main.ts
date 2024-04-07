import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

 
  const config = new DocumentBuilder()
    .setTitle('Desafio Picpay Backend (Junior)')
    .setDescription('Desafio para vaga de dev backend junior feito em NestJS')
    .setVersion('1.0')
    .addTag('PicPay')
    .build();
  //await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
