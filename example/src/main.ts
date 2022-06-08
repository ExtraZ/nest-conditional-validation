import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConditionalValidationPipe } from 'nest-conditional-validation';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ConditionalValidationPipe());
  // app.useGlobalPipes(new ValidationPipe({ strictGroups: true }));

  const config = new DocumentBuilder().setTitle('Example').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(3000);
}
bootstrap();
