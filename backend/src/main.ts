import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // 2. Global API prefix
  app.setGlobalPrefix('api');

  // 3. Global validation pipe: strips unallowed fields and validates DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Swagger / OpenAPI documentation setup
  const config = new DocumentBuilder()
    .setTitle('Inventory & Order Management API')
    .setDescription('Production REST API documentation for store inventory and orders')
    .setVersion('1.0')
    .addTag('System')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger Docs available at: http://localhost:${port}/api/docs`);
}
void bootstrap();
