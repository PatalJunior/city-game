import { Building } from '../building.js';
import { City } from '../../city.js';
import { DEG2RAD } from 'three/src/math/MathUtils.js';
import { BuildingType } from '../buildingType.js';

export class Road extends Building {
  constructor(x, y) {
    super(x, y);
    this.price = 100;
    this.type = BuildingType.road;
    this.name = 'Road';
    this.style = 'straight';
    this.hideTerrain = true;
    this.roadAccess.enabled = false;
    
    const roadCount = window.game.city.findAllTiles((tile) => tile.building?.type === BuildingType.road)
    roadCount.length += 1 // Adicionar a estrada atual visto que ainda não terminou de ser criada
    const event = new CustomEvent("roadBuilt", { detail: { value: roadCount.length } });
    window.dispatchEvent(event)
  }

  /**
   * Atualiza a malha da estrada com base em quais os blocos adjacentes que também são estradas
   * @param {City} city 
   * @param {DEG2RAD} // Converte número em graus para o valor equivalente em radianos
   */
  refreshView(city) {
    // Verifique quais as peças adjacentes que são estradas
    let top = (city.getTile(this.x, this.y - 1)?.building?.type === this.type) ?? false;
    let bottom = (city.getTile(this.x, this.y + 1)?.building?.type === this.type) ?? false;
    let left = (city.getTile(this.x - 1, this.y)?.building?.type === this.type) ?? false;
    let right = (city.getTile(this.x + 1, this.y)?.building?.type === this.type) ?? false;

    // Verifica todas as combinações
    // Interseção de cruzamentos
    if (top && bottom && left && right) {
      this.style = 'four-way';
      this.rotation.y = 0;
    // Interseções em T
    } else if (!top && bottom && left && right) { // Fundo Esquerda-Direita
      this.style = 'three-way';
      this.rotation.y  = 0;
    } else if (top && !bottom && left && right) { // Topo Esquerda-Direita
      this.style = 'three-way';
      this.rotation.y  = 180 * DEG2RAD;
    } else if (top && bottom && !left && right) { // Topo Fundo-Direita
      this.style = 'three-way';
      this.rotation.y  = 90 * DEG2RAD;
    } else if (top && bottom && left && !right) { // Topo Fundo-Esquerda
      this.style = 'three-way';
      this.rotation.y  = 270 * DEG2RAD;
    // Corner
    } else if (top && !bottom && left && !right) { // Topo Esquerda
      this.style = 'corner';
      this.rotation.y  = 180 * DEG2RAD;
    } else if (top && !bottom && !left && right) { // Topo Direita
      this.style = 'corner';
      this.rotation.y  = 90 * DEG2RAD;
    } else if (!top && bottom && left && !right) { // Fundo Esquerda
      this.style = 'corner';
      this.rotation.y  = 270 * DEG2RAD;
    } else if (!top && bottom && !left && right) { // Fundo Direita
      this.style = 'corner';
      this.rotation.y  = 0;
    // Straight
    } else if (top && bottom && !left && !right) { // Topo Fundo
      this.style = 'straight';
      this.rotation.y  = 0;
    } else if (!top && !bottom && left && right) { // Esquerda-Direita
      this.style = 'straight';
      this.rotation.y  = 90 * DEG2RAD;
    // Dead end
    } else if (top && !bottom && !left && !right) { // Topo
      this.style = 'end';
      this.rotation.y  = 180 * DEG2RAD;
    } else if (!top && bottom && !left && !right) { // Fundo
      this.style = 'end';
      this.rotation.y  = 0;
    } else if (!top && !bottom && left && !right) { // Esquerda
      this.style = 'end';
      this.rotation.y  = 270 * DEG2RAD;
    } else if (!top && !bottom && !left && right) { // Direita
      this.style = 'end';
      this.rotation.y  = 90 * DEG2RAD;
    }

    const mesh = window.assetManager.getModel(`road-${this.style}`, this);
    this.setMesh(mesh);
    city.vehicleGraph.updateTile(this.x, this.y, this);
  }

  /**
   * Retorna uma representação HTML deste objeto
   * @returns {string}
   */
  toHTML() {
    let html = super.toHTML();
    html += `
    <span class="info-label">Estilo: </span>
    <span class="info-value">${this.style}</span>
    <br>
    `;
    return html;
  }
}