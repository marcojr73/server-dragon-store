import { NestFactory } from '@nestjs/core';
import { SeederService } from '../src/core/seeder-module/seeder-service';
import { SeederModule } from '../src/core/seeder-module/seeder-module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeder = app.get(SeederService);

  try {
    console.log('🌱🌱🌱Seeding...');
    await seeder.seed();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
