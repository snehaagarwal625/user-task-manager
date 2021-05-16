import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger  = new Logger();
  const app = await NestFactory.create(AppModule);
  const serverCongif = config.get('server');
  if(process.env.NODE_ENV === 'development'){
    app.enableCors();
  } else {
    app.enableCors({origin: serverCongif.origin});
    logger.log(`acception requests from origin ${serverCongif.origin}`)
  }
  
  await app.listen(process.env.PORT||serverCongif.port);
}
bootstrap();
