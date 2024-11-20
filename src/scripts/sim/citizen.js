
import { ResidentialZone } from './buildings/zones/residential.js';
import config from '../config.js';

export class Citizen {
  /**
   * @param {ResidentialZone} residence 
   */
  constructor(residence) {
    /**
     * Identificador único do residente
     * @type {string}
     */
    this.id = crypto.randomUUID();

    /**
     * Nome do residente
     * @type {string}
     */
    this.name = generateRandomName();

    /**
     * Idade do residente em anos
     * @type {number}
     */
    this.age = 1 + Math.floor(100*Math.random());

    /**
     * Estado atual do residente
     * @type {'idle' | 'school' | 'employed' | 'unemployed' | 'retired'}
     */
    this.state = 'idle';

    /**
     * Número de passos de simulação do estado atual
     */
    this.stateCounter = 0;

    /**
     * Residência em que o residente reside
     * @type {ResidentialZone}
     */
    this.residence = residence;

    this.#initializeState();
  }

  /**
   * Definir o estado inicial do residente
   */
  #initializeState() {
    if (this.age < config.citizen.minWorkingAge) {
      this.state = 'school';
    } else if (this.age >= config.citizen.retirementAge) {
      this.state = 'retired';
    } else {
      this.state = 'unemployed';
    }
  }

  /**
   * Avança o estado do residente a cada passo
   * @param {object} city 
   */
  simulate(city) {
    switch (this.state) {
      case 'idle':
      case 'school':
      case 'retired':
        // Action - None

        // Transitions - None

        break;
      case 'unemployed':

        // TODO

        break;
      case 'employed':
        // Actions - None

        break;
      default:
        console.error(`Citizen ${this.id} is in an unknown state (${this.state})`);
    }
  }

  /**
   * Assegura a necessidade de limpeza antes da remoção
   */
  dispose() {

  }



  /**
   * Devolve a representação do objeto em HTML
   * @returns {string}
   */
  toHTML() {
    return `
      <li class="info-citizen">
        <span class="info-citizen-name">${this.name}</span>
        <br>
        <span class="info-citizen-details">
          <span>
            <img class="info-citizen-icon" src="/icons/calendar.png">
            ${this.age} 
          </span>
          <span>
            <img class="info-citizen-icon" src="/icons/job.png">
            ${this.state}
          </span>
        </span>
      </li>
    `;
  }
}

function generateRandomName() {
  const firstNames = [
    'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella',
    'Liam', 'Noah', 'William', 'James', 'Benjamin',
    'Elizabeth', 'Margaret', 'Alice', 'Dorothy', 'Eleanor',
    'John', 'Robert', 'William', 'Charles', 'Henry',
    'Alex', 'Taylor', 'Jordan', 'Casey', 'Robin'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown',
    'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
    'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
    'Clark', 'Lewis', 'Walker', 'Hall', 'Young',
    'Lee', 'King', 'Wright', 'Adams', 'Green'
  ];

  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return randomFirstName + ' ' + randomLastName;
}