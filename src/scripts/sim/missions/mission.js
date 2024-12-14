import { MissionType } from "./missionType.js";

export class Mission {
    /**
     *  O tipo de missão
     * @type {MissionType}
     */
    missionType;

    /**
     *  Descrição da missão
     * @type {string}
     */
    missionDescription;

    /**
     * Número de coisas concluidas para terminar a tarefa
     * @type {int}
     */
    missionObjectiveCount;


    /**
     * Número atual coisas concluidas para terminar a tarefa
     * @type {int}
     */
    _currentMissionObjectiveCount = 0;

    /**
     * Se a missão foi concluida
     * @type {int}
     */
    isMissionFinished = false;

    /**
     * Detetor de eventos
     * @type {function}
     */
    _eventListener = false;

    /**
     * Nome do evento
     * @type {string}
     */
    _eventName = false;

    constructor(missionType, missionDescription, missionObjectiveCount, eventName) {
        this.missionType = missionType;
        this.missionDescription = missionDescription;
        this.missionObjectiveCount = missionObjectiveCount;

        this.#setupEventListener(eventName);
    }

    /**
     * Atualiza o valor atual do objetivo da missão
     * @param {number} increment - O valor atual da missão
     */

    #updateMissionObjectiveCount(value) {
        this._currentMissionObjectiveCount = value;

        if (this._currentMissionObjectiveCount >= this.missionObjectiveCount) {
            this._currentMissionObjectiveCount = this.missionObjectiveCount;
            
            this.isMissionFinished = true;
            window.dispatchEvent(new CustomEvent("missionFinished"));
            this.#removeEventListener()
        }

        // console.log(`Current mission objective count: ${this._currentMissionObjectiveCount}`);
    }


    /**
     * Configura um event listener para atualizar o valor atual do objetivo da missão
     * @param {string} eventName - O nome do evento a detetar
     */
    #setupEventListener(eventName) {
        this._eventName = eventName
        this._eventListener = (event) => {
            // console.log("Event Triggered of " + this._eventName)
            if (event && event.detail && typeof event.detail.value === 'number') {
                this.#updateMissionObjectiveCount(event.detail.value);
            }
        };

        window.addEventListener(this._eventName, this._eventListener);
    }

    /**
     * Remove o event listener quando já não for mais preciso
     * @param {string} eventName - O nome do evento a parar de detetar
     */
    #removeEventListener(eventName) {
        if (this._eventListener && this._eventName) {
            window.removeEventListener(this._eventName, this._eventListener);
            this._eventListener = null;
            this._eventName = null;
        }
    }

}