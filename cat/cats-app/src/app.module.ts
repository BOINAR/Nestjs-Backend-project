import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_CONNECTION_STRING}`),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
