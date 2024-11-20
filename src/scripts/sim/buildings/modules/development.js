import config from '../../../config.js';
import { City } from '../../city.js';
import { Zone } from '../../buildings/zones/zone.js';
import { SimModule } from './simModule.js';

export const DevelopmentState = {
  abandoned: 'abandoned',
  developed: 'developed',
  underConstruction: 'under-construction',
  undeveloped: 'undeveloped',
};

export class DevelopmentModule extends SimModule {
  /**
   * Número de etapas de simulação em que o edifício cumpriu os critérios de abandono
   * Se os critérios de abandono não forem cumpridos, o valor será zero
   * @type {number}
   */
  #abandonmentCounter = 0;

  /**
   * Contador de dias em construção
   * @type {number}
   */
  #constructionCounter = 0;

  /**
   * Nível de desenvolvimento
   * @type {number}
   */
  #level = 1;

  /**
   * Nível máximo de desenvolvimento
   * @type {number}
   */
  maxLevel = 3;

  /**
   * O estado actual de desenvolvimento da zona
   * @type {string}
   */
  #state = DevelopmentState.undeveloped;

  /**
   * Objeto de zona
   * @type {Zone}
   */
  #zone;

  /**
   * 
   * @param {Zone} zone 
   */
  constructor(zone) {
    super();
    this.#zone = zone;
  }

  get level() {
    return this.#level;
  }

  set level(value) {
    this.#level = value;
    this.#zone.refreshView();
  }

  get state() {
    return this.#state;
  }

  set state(value) {
    this.#state = value;
    this.#zone.refreshView();
  }

  /**
   * @param {City} city 
   */
  simulate(city) {
    this.#checkAbandonmentCriteria();

    switch (this.state) {
      case DevelopmentState.undeveloped:
        if (this.#checkDevelopmentCriteria() &&
          Math.random() < config.modules.development.redevelopChance) {
          this.state = DevelopmentState.underConstruction;
          this.#constructionCounter = 0;
        }
        break;
      case DevelopmentState.underConstruction:
        if (++this.#constructionCounter === config.modules.development.constructionTime) {
          this.state = DevelopmentState.developed;
          this.level = 1;
          this.#constructionCounter = 0;
        }
        break;
      case DevelopmentState.developed:
        if (this.#abandonmentCounter > config.modules.development.abandonThreshold) {
          if (Math.random() < config.modules.development.abandonChance) {
            this.state = DevelopmentState.abandoned;
          }
        } else {
          if (this.level < this.maxLevel && Math.random() < config.modules.development.levelUpChance) {
            this.level++;
          }
        }
        break;
      case DevelopmentState.abandoned:
        if (this.#abandonmentCounter == 0) {
          if (Math.random() < config.modules.development.redevelopChance) {
            this.state = DevelopmentState.developed;
          }
        }
        break;
    }
  }

  /**
   * @param {City} city 
   * @returns 
   */
  #checkDevelopmentCriteria() {
    return (
      this.#zone.roadAccess.value
    );
  }

  /**
   * @param {City} city 
   * @returns 
   */
  #checkAbandonmentCriteria() {
    if (!this.#checkDevelopmentCriteria()) {
      this.#abandonmentCounter++;
    } else {
      this.#abandonmentCounter = 0;
    }
  }

  /**
   * Retorna uma representação HTML deste objeto
   * @returns {string}
   */
    toHTML() {
      return `
        <span class="info-label">State </span>
        <span class="info-value">${this.state}</span>
        <br>
        <span class="info-label">Level </span>
        <span class="info-value">${this.level}</span>
        <br>`;
    }
}