import config from '../../../config.js';
import { Citizen } from '../../citizen.js';
import { City } from '../../city.js';
import { Zone as ResidentialZone } from '../../buildings/zones/zone.js';
import { DevelopmentState } from './development.js';
import { SimModule } from './simModule.js';

/**
 * Lógica para residentes que entram e saem de um edifício
 */
export class ResidentsModule extends SimModule {
  /**
   * @type {ResidentialZone}
   */
  #zone;

  /**
   * @type {Citizen[]}
   */
  #residents = [];

  /**
   * @param {ResidentialZone} zone 
   */
  constructor(zone) {
    super();
    this.#zone = zone;
  }

  /**
   * Retorna o número de residentes
   * @type {number}
   */
  get count() {
    return this.#residents.length;
  }

  /**
   * Número máximo de residentes que podem viver no edifício
   * @returns {number}
   */
  get maximum() {
    return Math.pow(config.modules.residents.maxResidents, this.#zone.development.level);
  }

  /**
   * @param {City} city 
   */
  simulate(city) {
    // Se o edifício for abandonado, todos os residentes serão despejados e nenhum novo residente pode residir
    if (this.#zone.development.state === DevelopmentState.abandoned && this.#residents.length > 0) {
      this.evictAll();
    } else if (this.#zone.development.state === DevelopmentState.developed) {
      // Mudar para lá novos residentes no caso de haver espaço
      if (this.#residents.length < this.maximum && Math.random() < config.modules.residents.residentMoveInChance) {
        this.#residents.push(new Citizen(this.#zone));
      }
    }

    for (const resident of this.#residents) {
      resident.simulate(city);
    }
  }

  /**
   * Despeja todos os residentes do prédio
   */
  #evictAll() {
    for (const resident of this.#residents) {
      resident.dispose();
    }
    this.#residents = [];
  }

  /**
   * Trata de qualquer limpeza necessária antes de um edifício ser removido
   */
  dispose() {
    this.#evictAll();
  }

  /**
   * Retorna uma representação HTML deste objeto
   * @returns {string}
   */
  toHTML() {
    let html = `<div class="info-heading">Moradores (${this.#residents.length}/${this.maximum})</div>`;

    html += '<ul class="info-citizen-list">';
    for (const resident of this.#residents) {
      html += resident.toHTML();
    }
    html += '</ul>';

    return html;
  }
}