import config from '../../../config.js';
import { City } from '../../city.js';
import { Building } from '../building.js';
import { SimModule } from './simModule.js';

/**
 * Lógica para determinar se um bloco tem ou não acesso por ruas
 */
export class RoadAccessModule extends SimModule {
  /**
   * @type {Building}
   */
  building;
  /**
   * @type {boolean}
   */
  enabled = true;
  /**
   * Se o bloco tem ou não acesso a uma estrada
   * @type {boolean}
   */
  value;

  /**
   * @param {Building} building 
   */
  constructor(building) {
    super();
    this.building = building;
  }

  /**
   * Atualiza o estado deste atributo
   * @param {City} city 
   */
  simulate(city) {
    if (!this.enabled) {
      this.value = true;
    } else {
      const road = city.findTile(
        this.building, 
        (tile) => tile.building?.type === 'road', 
        config.modules.roadAccess.searchDistance);

      this.value = (road !== null);
    }
  }
}