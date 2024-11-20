import { City } from '../../city.js';
import { Zone } from './zone.js';
import { ResidentsModule } from '../modules/residents.js';
import { BuildingType } from '../buildingType.js';

export class ResidentialZone extends Zone {
  /**
   * @type {ResidentsModule}
   */
  residents = new ResidentsModule(this);

  constructor(x, y) {
    super(x, y);
    this.name = generateBuildingName();
    this.type = BuildingType.residential;
  }

  /**
   * Avança o estado da zona no tempo numa etapa de simulação
   * @param {City} city 
   */
  simulate(city) {
    super.simulate(city);
    this.residents.simulate(city);
  }

  /**
   * Trata de qualquer limpeza necessária antes de uma construção ser removido
   */
  dispose() {
    this.residents.dispose();
    super.dispose();
  }

  /**
   * Retorna uma representação HTML deste objeto
   * @returns {string}
   */
  toHTML() {
    let html = super.toHTML();
    html += this.residents.toHTML();
    return html;
  }
}

// Tabela com diferentes nomes
const prefixes = ['Emerald', 'Ivory', 'Crimson', 'Opulent', 'Celestial', 'Enchanted', 'Serene', 'Whispering', 'Stellar', 'Tranquil'];
const suffixes = ['Tower', 'Residence', 'Manor', 'Court', 'Plaza', 'House', 'Mansion', 'Place', 'Villa', 'Gardens'];

// Função para gerar um nome de construção aleatória
function generateBuildingName() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return prefix + ' ' + suffix;
}