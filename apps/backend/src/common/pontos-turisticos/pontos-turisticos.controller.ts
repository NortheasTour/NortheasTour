import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { PontosTuristicosService } from './pontos-turisticos.service';

/**
 * Endpoint ESTRATÉGICO para cache: a listagem geral de pontos turísticos.
 *
 * Por que este endpoint e não outro (ex: previsão do tempo)?
 * - É um dado "estável": pontos turísticos não mudam de um minuto para o
 *   outro, mudam em dias/semanas (quando um novo ponto é cadastrado).
 * - É um dado muito requisitado: provavelmente a rota mais chamada da
 *   aplicação (toda tela inicial/mapa consulta a listagem completa).
 * - Não depende de parâmetros por usuário (não é uma rota autenticada
 *   nem personalizada) — o mesmo resultado serve para todo mundo, o que
 *   é o cenário ideal para cache HTTP simples.
 *
 * TTL escolhido: 5 minutos (300.000ms).
 * Justificativa para a banca: é um equilíbrio entre performance
 * (evita bater no banco a cada requisição) e "frescor" do dado — se um
 * ponto turístico novo for cadastrado, o pior caso é ele demorar até
 * 5 minutos para aparecer na listagem pública, o que é aceitável para
 * este tipo de conteúdo. Poderia ser maior (ex: 1h) já que o dado muda
 * pouco, mas 5 min já demonstra o interceptor funcionando de forma
 * perceptível em testes/demonstração.
 */
@Controller('pontos-turisticos')
export class PontosTuristicosController {
  constructor(private readonly pontosService: PontosTuristicosService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('pontos_turisticos_listagem')
  @CacheTTL(300000) // 5 minutos, em milissegundos
  async findAll() {
    return this.pontosService.findAll();
  }
}
