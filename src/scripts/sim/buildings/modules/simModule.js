import { City } from '../../city.js';

export class SimModule {
  /**
   * Simula a passagem de um dia
   * @param {City} city 
   */
  simulate(city) {
    // Implementar na subclasse
  }

  /**
   * Limpa este módulo, descartando quaisquer ativos e desvinculando quaisquer referências
   */
  dispose() {
    // Implementar na subclasse
  }

  /**
   * Retorna uma representação HTML deste objeto
   * @returns {string}
   */
  toHTML() {
    // Implementar na subclasse
  }
}