import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const DEFAULT_SWAGGER_PATH = '/api/docs';

function isSwaggerEnabled(): boolean {
  const explicit = process.env.SWAGGER_ENABLED?.toLowerCase();
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

export function setupSwagger(app: INestApplication): void {
  if (!isSwaggerEnabled()) {
    return;
  }

  const cookieName = process.env.AUTH_COOKIE_NAME ?? 'access_token';
  const swaggerPath = process.env.SWAGGER_PATH ?? DEFAULT_SWAGGER_PATH;
  const sessionScheme = 'session';

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('HTTP API for admin and resources')
    .setVersion('1.0')
    .addCookieAuth(sessionScheme, {
      type: 'apiKey',
      in: 'cookie',
      name: cookieName,
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
