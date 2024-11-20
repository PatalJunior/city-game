import * as THREE from 'three';
import { SimModule } from './buildings/modules/simModule';

const SELECTED_COLOR = 0xaaaa55;
const HIGHLIGHTED_COLOR = 0x555555;

export class SimObject extends THREE.Object3D {
  /**
   * @type {THREE.Mesh?}
   */
  #mesh = null;
  /**
   * Posição do objeto no "mundo"
   * @type {THREE.Vector3}
   */
  #worldPos = new THREE.Vector3();

  /**
   * @param {number} x Coordenada X do objeto 
   * @param {number} y Coordenada Y do objeto
   */
  constructor(x = 0, y = 0) {
    super();
    this.name = 'SimObject';
    this.position.x = x;
    this.position.z = y;
  }

  get x() {
    this.getWorldPosition(this.#worldPos);
    return Math.floor(this.#worldPos.x);
  }

  get y() {
    this.getWorldPosition(this.#worldPos);
    return Math.floor(this.#worldPos.z);
  }

  /**
   * @type {THREE.Mesh?}
   */
  get mesh() {
    return this.#mesh;
  } 

  /**
   * @type {THREE.Mesh} valor
   */
  setMesh(value) {
    // Remover recursos da malha existente
    if (this.#mesh) {
      this.dispose();
      this.remove(this.#mesh);
    }

    this.#mesh = value;

    // Adicionar a malha à scene
    if (this.#mesh) {
      this.add(this.#mesh);
    }
  }

  /**
   * Atualiza o estado do objeto a cada passo de simulação
   * @param {City} city 
   */
  simulate(city) {
    // Sobrepõe a class
  }

  setSelected(value) {
    if (value) {
      this.#setMeshEmission(SELECTED_COLOR);
    } else {
      this.#setMeshEmission(0);
    }
  }

  setFocused(value) {
    if (value) {
      this.#setMeshEmission(HIGHLIGHTED_COLOR);
    } else {
      this.#setMeshEmission(0);
    }
  }

  /**
   * Define a cor de emissão da malha 
   * @param {number} color 
   */
  #setMeshEmission(color) {
    if (!this.mesh) return;
    this.mesh.traverse((obj) => obj.material?.emissive?.setHex(color));
  }

  /**
   * Assegura que o objeto deve ser limpo antes de ser removido
   */
  dispose() {
    this.#mesh.traverse((obj) => {
      if (obj.material) {
        obj.material?.dispose();
      }
    })
  }
}