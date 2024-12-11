import { MissionList } from "./missionList.js";  // Assuming MissionList is in a separate file

export class MissionLevel {
    /**
     * Lista de MissionList para o nível, representando as várias etapas do nível
     * @type {Array[MissionList]}
     */
    missionLists = [];

    /**
     * Indica o índice do MissionList atual (nível atual)
     * @type {number}
     */
    currentLevel = 1;

    /**
     * Construtor que cria um nível de missões com várias MissionList
     * @param {Array} levelsData - Dados das listas de missões para os níveis
     */
    constructor(levelsData) {
        this.missionLists = levelsData.map((missionsData) => {
            return new MissionList(missionsData);
        });
    }

    /**
     * Verifica se o nível foi concluído, ou seja, se todas as missões da lista estão concluídas
     * @returns {boolean}
     */
    isCurrentLevelFinished() {
        const currentMissionList = this.missionLists[this.currentLevel];
        return currentMissionList.isMissionListFinished();
    }

    /**
     * Avança para o próximo nível, caso o nível atual tenha sido concluído
     */
    advanceLevel() {
        if (this.isCurrentLevelFinished()) {
            // Avançar para o próximo nível, se o atual foi completado
            if (this.currentLevel < this.missionLists.length - 1) {
                this.currentLevel++;
            } else {
                console.log("Todos os níveis foram completados!");
            }
        } else {
            console.log(`Complete as missões do nível ${this.currentLevel + 1} para avançar.`);
        }
    }

    /**
     * O ultimo nivel está completado ?
     * @returns {boolean}
     */
    isLastLevelFinished() {
        if (this.currentLevel == this.missionLists.length - 1) {
            const currentMissionList = this.missionLists[this.currentLevel];
            return currentMissionList.isMissionListFinished();
        }

        return false;
    }
}
