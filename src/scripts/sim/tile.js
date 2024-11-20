import * as THREE from 'three';
import { Building } from './buildings/building.js';
import { SimObject } from './simObject.js';

export class Tile extends SimObject {
  /**
   * Tipo de terreno
   * @type {string}
   */
  terrain = 'grass';
  /**
   * Objeto de construção
   * @type {Building?}
   */
  #building = null;

  constructor(x, y) {
    super(x, y);
    this.name = `Tile-${this.x}-${this.y}`;
  }

  /**
   * @type {Building}
   */
  get building() {
    return this.#building;
  }

  /**
   * @type {Building} valor
   */
  setBuilding(value) {
    // Remove e descarta recursos da construção existente
    if (this.#building) {
      this.#building.dispose();
      this.remove(this.#building);
    }

    this.#building = value;

    // Adiciona o objeto à scene
    if (value) {
      this.add(this.#building);
    }
  }

  refreshView(city) {
    this.building?.refreshView(city);
    if (this.building?.hideTerrain) {
      this.setMesh(null);
    } else {
      /**
       * @type {THREE.Mesh}
       */
      const mesh = window.assetManager.getModel(this.terrain, this);
      mesh.name = this.terrain;
      this.setMesh(mesh);
    }
  }

  simulate(city) {
    this.building?.simulate(city);
  }

  /**
   * Obtém a distância da cidade entre dois blocos
   * @param {Tile} tile 
   * @returns 
   */
  distanceTo(tile) {
    return Math.abs(this.x - tile.x) + Math.abs(this.y - tile.y);
  }

  /**
   * 
   * @returns {string} Representação do objeto em HTML
   */
  toHTML() {
    let html = `
      <div class="info-heading">Bloco</div>
      <span class="info-label">Coordenadas </span>
      <span class="info-value">X: ${this.x}, Y: ${this.y}</span>
      <br>
      <span class="info-label">Terreno </span>
      <span class="info-value">${this.terrain}</span>
      <br>
    `;

    if (this.building) {
      html += this.building.toHTML();
    }

    return html;
  }
};