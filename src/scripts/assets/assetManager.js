import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import viteConfig from '../../../vite.config.js';
import models from './models.js';

const baseUrl = viteConfig.base;

export class AssetManager {
  textureLoader = new THREE.TextureLoader();
  modelLoader = new GLTFLoader();

  textures = {
    'base': this.#loadTexture(`${baseUrl}textures/base.png`),
    'specular': this.#loadTexture(`${baseUrl}textures/specular.png`),
    'grid': this.#loadTexture(`${baseUrl}textures/grid.png`),
    
  };

  statusIcons = {
    'no-road-access': this.#loadTexture(`${baseUrl}statusIcons/no-road-access.png`, true),
  }

  models = {};

  sprites = {};

  constructor(onLoad) {
    this.modelCount = Object.keys(models).length;
    this.loadedModelCount = 0;

    for (const [name, meta] of Object.entries(models)) {
      this.#loadModel(name, meta);
    }

    this.onLoad = onLoad;
  }

  /**
   * Retorna uma cópia duplicada da malha
   * @param {string} name O nome da malha recebida
   * @param {Object} simObject O objeto SimObject que corresponde a esta malha
   * @param {boolean} transparent True se os materiais devem ser transparentes. O padrão é False.
   * @returns {THREE.Mesh}
   */
  getModel(name, simObject, transparent = false) {
    const mesh = this.models[name].clone();
    // Duplica materiais para que cada objeto tenha um material único
    // Isto para que possamos definir a alteração da textura de cada
    // malha de forma independente (por exemplo, realce ao passar o rato,
    // edifícios abandonados, etc.))
    mesh.traverse((obj) => {
      obj.userData = simObject;
      if(obj.material) {
        obj.material = obj.material.clone();
        obj.material.transparent = transparent;
      }
    });

    return mesh;
  }
  
  /**
   * Carrega a textura no URL especificado
   * @param {string} url 
   * @returns {THREE.Texture} Textura do objeto
   */
  #loadTexture(url, flipY = false) {
    const texture = this.textureLoader.load(url)
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = flipY;
    return texture;
  }

  /**
   * Lê o modelo 3D
   * @param {string} url URL do modelo a ser lido
   */
  #loadModel(name, {filename, scale = 1, rotation = 0, receiveShadow = true, castShadow = true}) {
    console.log(`Loading: ${baseUrl}models/${filename}`)
    this.modelLoader.load(`${baseUrl}models/${filename}`,
      (glb) => {
        let mesh = glb.scene;
        
        mesh.name = filename;

        mesh.traverse((obj) => {
          if (obj.material) {
            obj.material = new THREE.MeshLambertMaterial({
              map: this.textures.base,
              specularMap: this.textures.specular,
            })
            obj.receiveShadow = receiveShadow;
            obj.castShadow = castShadow;
          }
        });

        mesh.rotation.set(0, THREE.MathUtils.degToRad(rotation), 0);
        mesh.scale.set(scale / 30, scale / 30, scale / 30);

        this.models[name] = mesh;

        // Quanto todos os modelos são lidos
        this.loadedModelCount++;
        if (this.loadedModelCount == this.modelCount) {
          this.onLoad()
        }
      },
      (xhr) => {
        //console.log(`${name} ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error(error);
      });
  }
}