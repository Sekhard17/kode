import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // API Versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('KODE API')
    .setDescription('API para e-commerce de ropa KODE')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar API Reference (modern docs UI)
  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'purple',
    }),
  );

  // Also expose raw OpenAPI JSON
  SwaggerModule.setup('docs/swagger', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 KODE API running on http://localhost:${port}`);
  console.log(`📚 API Docs available at http://localhost:${port}/docs`);
}

bootstrap();
