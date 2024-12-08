import * as THREE from 'three';
import { SimObject } from '../simObject';
import { BuildingStatus } from './buildingStatus';
import { RoadAccessModule } from './modules/roadAccess';

export class Building extends SimObject {
  /**
   * Tipo de construção
   * @type {string}
   */
  type = 'building';
  /**
   * Terreno não deve ser renderizado com este tipo de construção
   * @type {boolean}
   */
  hideTerrain = false;
  /**
   * @type {RoadAccessModule}
   */
  roadAccess = new RoadAccessModule(this);
  /**
   * Estado atual da construção
   * @type {string}
   */
  status = BuildingStatus.Ok;

  /**
   * Preço da construção
   * @type {int}
  */
  price = 500;

  /**
   * Ícone apresentado no estado da construção
   * @type {Sprite}
   */
  #statusIcon = new THREE.Sprite();

  constructor() {
    super();
    this.#statusIcon.visible = false;
    this.#statusIcon.material = new THREE.SpriteMaterial({ depthTest: false })
    this.#statusIcon.layers.set(1);
    this.#statusIcon.scale.set(0.5, 0.5, 0.5);
    this.add(this.#statusIcon);
  }
  
  /**
   * 
   * @param {*} status 
   */
  setStatus(status) {
    if (status !== this.status) {
      switch(status) {
        case BuildingStatus.NoRoadAccess:
          this.#statusIcon.visible = true;
          this.#statusIcon.material.map = window.assetManager.statusIcons[BuildingStatus.NoRoadAccess];
          break;
        default:
          this.#statusIcon.visible = false;
      }
    }
  }

  simulate(city) {
    super.simulate(city);
    
    this.roadAccess.simulate(city);

    if (!this.roadAccess.value) {
      this.setStatus(BuildingStatus.NoRoadAccess);
    } else {
      this.setStatus(null);
    }
  }

  dispose() {
    this.roadAccess.dispose();
    super.dispose();
  }
  
  /**
   * Retorna uma representação HTML deste objeto
   * @returns {string}
   */
  toHTML() {
    var html;
    if (this.type == "residential") {
      let haveRoadAcess = (this.roadAccess.value ? "Sim" : "<br>Não (Necessita Para Evoluir)")
      html = `
        <div class="info-heading">Edifício</div>
        <span class="info-label">Nome: </span>
        <span class="info-value">${this.name}</span>
        <br>
        <span class="info-label">Tipo: </span>
        <span class="info-value">$Residência</span>
        <br>
        <span class="info-label">Acesso Por Ruas: </span>
        <span class="info-value">${haveRoadAcess}</span>
        <br>`;
    } else if (this.type == "road") {
      html = `
        <div class="info-heading">Estrada</div>`;
    }

    return html;
  }
}