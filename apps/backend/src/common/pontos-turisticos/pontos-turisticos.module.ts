import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PontosTuristicosController } from './pontos-turisticos.controller';
import { PontosTuristicosService } from './pontos-turisticos.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300000, // TTL padrão do módulo: 5 minutos (ms). O controller pode sobrescrever com @CacheTTL.
      max: 100, // número máximo de entradas em cache (evita crescimento ilimitado em memória)
    }),
  ],
  controllers: [PontosTuristicosController],
  providers: [PontosTuristicosService],
})
export class PontosTuristicosModule {}
