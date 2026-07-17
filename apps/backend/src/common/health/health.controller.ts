import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

/**
 * Rota /health — usada por orquestradores (Docker, Kubernetes, Render,
 * Railway, etc.) e por monitoramento externo para saber se a aplicação
 * está de pé e operando dentro de limites aceitáveis.
 *
 * Verificações incluídas:
 * - Memória heap não deve ultrapassar 300MB (evita alarme falso em apps pequenas,
 *   ajuste conforme o ambiente real de produção).
 * - Espaço em disco: pelo menos 10% livre no volume raiz.
 * - Ping na própria API pública que a aplicação consome (OpenWeatherMap),
 *   apenas como indicador informativo — não derruba o healthcheck sozinho
 *   pois é uma dependência externa (ver nota abaixo).
 *
 * OBS: se o projeto tiver banco de dados (TypeORM/Mongoose/Prisma), adicione
 * aqui também um indicador de DB (ex: TypeOrmHealthIndicator) — é o item
 * mais importante de um health check real.
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9, // falha se menos de 10% de espaço livre
        }),
      // Exemplo de dependência externa monitorada sem derrubar o healthcheck
      // principal em caso de instabilidade pontual da API de terceiros:
      // () => this.http.pingCheck('openweathermap', 'https://api.openweathermap.org'),
    ]);
  }
}
