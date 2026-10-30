import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';
import { AppModule } from './app.module';

async function generateOpenApi() {
  // Create application context without binding to a network port
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Ground Station API')
    .setDescription('Ground Station API Contract')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 1. Export JSON contract
  const jsonPath = resolve(process.cwd(), 'openapi.json');
  writeFileSync(jsonPath, JSON.stringify(document, null, 2), 'utf8');

  // 2. Export YAML contract (optional)
  const yamlPath = resolve(process.cwd(), 'openapi.yaml');
  writeFileSync(yamlPath, yaml.dump(document), 'utf8');

  console.log(`OpenAPI contracts generated at:\n - ${jsonPath}\n - ${yamlPath}`);

  await app.close();
}

generateOpenApi();