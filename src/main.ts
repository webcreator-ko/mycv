import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdfasfd']
  }))

  app.useGlobalPipes(
    new ValidationPipe({
      // dtoで定義した以外の値は取得しないようにする
      whitelist: true
    })
  )
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
