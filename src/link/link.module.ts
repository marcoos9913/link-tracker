// link.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { Link } from './link.entity'; // Importa la entidad Link

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]), // Incluye Link y LinkRepository en TypeOrmModule
  ],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
