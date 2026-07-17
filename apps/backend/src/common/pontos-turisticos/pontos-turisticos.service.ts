import { Injectable } from '@nestjs/common';

export interface PontoTuristico {
  id: number;
  nome: string;
  cidade: string;
  lat: number;
  lon: number;
  categoria: string;
}

/**
 * Service de exemplo. Em um projeto real, isso viria do banco de dados
 * (TypeORM/Prisma/Mongoose). O importante aqui é que a LISTAGEM de pontos
 * turísticos é um dado que muda com pouquíssima frequência (dias/semanas),
 * o que a torna uma ótima candidata a cache — diferente da previsão do
 * tempo (que muda o tempo todo e por isso NÃO deve ser cacheada, ou deve
 * ter um TTL bem mais curto).
 */
@Injectable()
export class PontosTuristicosService {
  private readonly pontos: PontoTuristico[] = [
    { id: 1, nome: 'Praia do Futuro', cidade: 'Fortaleza', lat: -3.7431, lon: -38.4519, categoria: 'praia' },
    { id: 2, nome: 'Catedral Metropolitana', cidade: 'Fortaleza', lat: -3.7275, lon: -38.5265, categoria: 'cultura' },
    { id: 3, nome: 'Mercado Central', cidade: 'Fortaleza', lat: -3.7268, lon: -38.5259, categoria: 'compras' },
  ];

  async findAll(): Promise<PontoTuristico[]> {
    // Simula uma consulta "pesada" ao banco de dados, para deixar visível
    // o ganho de performance do cache (na 1ª chamada demora, nas seguintes
    // dentro do TTL a resposta é instantânea).
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.pontos;
  }
}
