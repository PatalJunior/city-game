import * as THREE from 'three';
import { BuildingType } from './buildings/buildingType.js';
import { createBuilding } from './buildings/buildingFactory.js';
import { Tile } from './tile.js';
import { VehicleGraph } from './vehicles/vehicleGraph.js';
import { SimService } from './services/simService.js';
import { MissionLevel } from './missions/missionLevel.js';
export class City extends THREE.Group {
  /**
   * Grupo separado para organizar meshes de depuração
   * para que não sejam incluídas em verificações de raycasting
   * @type {THREE.Group}
   */
  debugMeshes = new THREE.Group();

  /**
   * Nó raiz para todos os objetos da cena
   * @type {THREE.Group}
   */
  root = new THREE.Group();

  /**
   * Lista de serviços disponíveis na cidade
   * @type {SimService[]}
   */
  services = [];

  /**
   * Tamanho da cidade em ladrilhos
   * @type {number}
   */
  size = 6;

  /**
   * Tempo atual da simulação
   */
  simTime = 0;

  /**
   * Matriz 2D representando os blocos da cidade
   * @type {Tile[][]}
   */
  tiles = [];

  /**
   * Grafo de veículos para gerenciar conexões e rotas
   * @type {VehicleGraph}
   */
  vehicleGraph;

  /**
   * Lista de missões a completar no nivel
   * @type {MissionLevel}
   */
  missionLevel;


  // Construtor da cidade
  constructor(size, money, name = 'Patal & oSLaYN City', missionData) {
    super(); // Inicializa a classe pai (THREE.Group)

    this.name = name;
    this.size = size;
    this.money = money;


    this.add(this.debugMeshes); // Adiciona meshes de depuração
    this.add(this.root);        // Adiciona o nó raiz

    // Cria a matriz de tiles (blocos da cidade)
    this.tiles = [];
    for (let x = 0; x < this.size; x++) {
      const column = [];
      for (let y = 0; y < this.size; y++) {
        const tile = new Tile(x, y); // Cria cada tile
        tile.refreshView(this);     // Atualiza a visualização do tile
        this.root.add(tile);        // Adiciona ao nó raiz
        column.push(tile);          // Adiciona o tile à coluna
      }
      this.tiles.push(column);      // Adiciona a coluna à matriz
    }

    if (missionData)
      this.missionLevel = new MissionLevel(missionData)

    this.services = []; // Inicializa a lista de serviços

    // Inicializa o grafo de veículos
    this.vehicleGraph = new VehicleGraph(this.size);
    this.debugMeshes.add(this.vehicleGraph); // Adiciona ao grupo de depuração
  }

  /**
   * Retorna a população total da cidade
   * @type {number}
   */
  get population() {
    let population = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const tile = this.getTile(x, y);
        population += tile.building?.residents?.count ?? 0; // Soma a população de cada tile
      }
    }
    return population;
  }

  /**
   * Retorna o tile nas coordenadas especificadas.
   * Se estiver fora dos limites, retorna `null`.
   * @param {number} x Coordenada x do tile
   * @param {number} y Coordenada y do tile
   * @returns {Tile | null}
   */
  getTile(x, y) {
    if (
      x === undefined || y === undefined ||
      x < 0 || y < 0 ||
      x >= this.size || y >= this.size
    ) {
      return null;
    } else {
      return this.tiles[x][y];
    }
  }

  /**
   * Avança a simulação em um ou mais passos
   * @type {number} steps Número de passos a simular
   */
  simulate(steps = 1) {
    let count = 0;
    var roadCount = 0;
    var buildCount = 0;
    while (count++ < steps) {
      // Atualiza os serviços
      this.services.forEach((service) => service.simulate(this));

      // Atualiza cada tile
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          const building = this.getTile(x, y).building;
          if (building) {
            if (building.type === BuildingType.residential) {
              buildCount++;
            } else if (building.type === BuildingType.road) {
              roadCount++;
            }
          }
          this.getTile(x, y).simulate(this);
        }
      }
    }

    if (this.missionLevel.isCurrentLevelFinished()) {
      this.missionLevel.advanceLevel();
      this.increaseSize(1);
    }


    this.simTime++; // Incrementa o tempo da simulação
  }

  /**
  * Verifica se a cidade tem dinheiro para construção de X edificio
  * @param {BuildingType} buildingType Tipo de construção
  */
  hasMoneyForBuild(buildingType) {
    if (buildingType == BuildingType.residential && this.money >= 500) {
      this.money -= 500;
      return true;
    } else if (buildingType == BuildingType.road && this.money >= 100) {
      this.money -= 100;
      return true;
    }
    return false
  }

  /**
   * Coloca um edifício em um tile especificado
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   * @param {string} buildingType Tipo do edifício
   */
  placeBuilding(x, y, buildingType) {
    const tile = this.getTile(x, y);

    // Verifica se o tile já possui um edifício
    if (tile && !tile.building) {
      const hasMoney = this.hasMoneyForBuild(buildingType);
      if (hasMoney) {
        window.ui.soundEffect("building");
        tile.setBuilding(createBuilding(x, y, buildingType));
        tile.refreshView(this);

        // Atualiza a visualização dos tiles vizinhos (ex: para estradas)
        this.getTile(x - 1, y)?.refreshView(this);
        this.getTile(x + 1, y)?.refreshView(this);
        this.getTile(x, y - 1)?.refreshView(this);
        this.getTile(x, y + 1)?.refreshView(this);

        // Atualiza o grafo de veículos se o edifício for uma estrada
        if (tile.building.type === BuildingType.road) {
          this.vehicleGraph.updateTile(x, y, tile.building);
          window.ui.notify('moneyTake', 'Estrada Construida: -100$');
        } else { window.ui.notify('moneyTake', 'Edifício Construido: -500$'); }

      } else {
        window.ui.notify('error', 'Dinheiro Insuficiente.');
      }
    }


  }

  /**
   * Demole um edifício em um tile especificado
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  bulldoze(x, y) {
    const tile = this.getTile(x, y);

    if (tile.building) {
      // Remove do grafo de veículos se for uma estrada
      if (tile.building.type === BuildingType.road) {
        this.money += 50;
        this.vehicleGraph.updateTile(x, y, null);
        window.ui.notify('moneyGive', 'Estrada Destruida: +50$');
      } else if (tile.building.type === BuildingType.residential) {
        window.ui.notify('moneyGive', 'Edifício Destruido: +250$');
        this.money += 250;
      }

      window.ui.soundEffect("bulldoze");
      tile.building.dispose(); // Libera recursos do edifício
      tile.setBuilding(null); // Remove o edifício
      tile.refreshView(this);

      // Atualiza os tiles vizinhos
      this.getTile(x - 1, y)?.refreshView(this);
      this.getTile(x + 1, y)?.refreshView(this);
      this.getTile(x, y - 1)?.refreshView(this);
      this.getTile(x, y + 1)?.refreshView(this);
    }
  }

  destroy(x, y) {
    const tile = this.getTile(x, y);

    if (tile.building) {
      if (tile.building.type === BuildingType.residential) {
        this.vehicleGraph.updateTile(x, y, null);
        window.ui.notify('error', 'Edifício Explodido!');
        window.ui.notify('error', 'Residentes Não Sobreviveram!');
        window.ui.soundEffect("explosion");
        tile.building.dispose(); // Libera recursos do edifício
        tile.setBuilding(null); // Remove o edifício
        tile.refreshView(this);
        this.getTile(x - 1, y)?.refreshView(this);
        this.getTile(x + 1, y)?.refreshView(this);
        this.getTile(x, y - 1)?.refreshView(this);
        this.getTile(x, y + 1)?.refreshView(this);
      }
    }
  }

  /**
   * Desenha ou atualiza a representação visual da cidade
   */

  draw() {
    // Método para ser implementado no futuro
    if (window.ui.isPaused || window.ui.isFinished) { return; }
  }

  /**
   * Encontra o primeiro tile que atende aos critérios fornecidos
   * @param {{x: number, y: number}} start Coordenadas iniciais
   * @param {(Tile) => (boolean)} filter Função para filtrar tiles
   * @param {number} maxDistance Distância máxima para busca
   * @returns {Tile | null} O primeiro tile que atende aos critérios ou `null`
   */
  findTile(start, filter, maxDistance) {
    const startTile = this.getTile(start.x, start.y);
    const visited = new Set();
    const tilesToSearch = [];

    // Inicializa a busca com o tile de início
    tilesToSearch.push(startTile);

    while (tilesToSearch.length > 0) {
      const tile = tilesToSearch.shift();

      // Ignora tiles já visitados
      if (visited.has(tile.id)) {
        continue;
      } else {
        visited.add(tile.id);
      }

      // Verifica se o tile está fora do limite de distância
      const distance = startTile.distanceTo(tile);
      if (distance > maxDistance) continue;

      // Adiciona vizinhos à lista de busca
      tilesToSearch.push(...this.getTileNeighbors(tile.x, tile.y));

      // Retorna o tile se passar nos critérios
      if (filter(tile)) {
        return tile;
      }
    }

    return null; // Nenhum tile encontrado
  }

  /**
 * Aumenta o tamanho da cidade expandindo a grade.
 * @param {number} increment Número de ladrilhos para aumentar o tamanho (padrão é 1).
 */
  increaseSize(increment = 1) {
    const newSize = this.size + increment;

    for (let x = 0; x < newSize; x++) {
      if (!this.tiles[x]) {
        this.tiles[x] = [];
      }

      for (let y = 0; y < newSize; y++) {
        if (!this.tiles[x][y]) {
          const tile = new Tile(x, y);
          tile.refreshView(this);
          this.root.add(tile);
          this.tiles[x][y] = tile;
        }
      }
    }

    this.size = newSize;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        this.tiles[x][y].refreshView(this);
      }
    }

    this.vehicleGraph = new VehicleGraph(this.size);
    window.game.setupGrid(window.game.city);
    window.game.developedResidenceEvent();
    window.ui.notify('inform', `Tamanho da cidade aumentado para ${this.size}x${this.size}`);
  }


  /**
 * Encontra todos os tiles que atendem aos critérios fornecidos
 * @param {(Tile) => (boolean)} filter Função para filtrar tiles
 * @returns {Tile[]} Uma lista de tiles que atendem aos critérios
 */
  findAllTiles(filter) {
    const tilesToSearch = this.tiles.flat();
    const visited = new Set();
    const matchingTiles = [];

    while (tilesToSearch.length > 0) {
      const tile = tilesToSearch.shift();

      // Ignora tiles já visitados
      if (visited.has(tile.id)) {
        continue;
      } else {
        visited.add(tile.id);
      }

      // Adiciona o tile à lista se passar nos critérios
      if (filter(tile)) {
        matchingTiles.push(tile);
      }

      // Adiciona vizinhos à lista de busca
      tilesToSearch.push(...this.getTileNeighbors(tile.x, tile.y));
    }

    return matchingTiles; // Retorna todos os tiles encontrados
  }


  /**
   * Retorna os vizinhos de um tile
   * @param {number} x Coordenada x
   * @param {number} y Coordenada y
   */
  getTileNeighbors(x, y) {
    const neighbors = [];

    if (x > 0) {
      neighbors.push(this.getTile(x - 1, y));
    }
    if (x < this.size - 1) {
      neighbors.push(this.getTile(x + 1, y));
    }
    if (y > 0) {
      neighbors.push(this.getTile(x, y - 1));
    }
    if (y < this.size - 1) {
      neighbors.push(this.getTile(x, y + 1));
    }

    return neighbors;
  }

  toHTML() {
  }
}
