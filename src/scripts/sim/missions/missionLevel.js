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
    currentLevel = 0;

    /**
     * Se todas as missões foram concluidas
     * @type {Boolean}
     */
    missionsFinished = false;

    /**
     * Construtor que cria um nível de missões com várias MissionList
     * @param {Array} levelsData - Dados das listas de missões para os níveis
     */
    constructor(levelsData) {
        this.missionLists = levelsData.map((level) => {
            const { missions, reward } = level;
            if (!missions || !reward) {
                console.log("Incorrect missions format !")
                return;
            }
            
            return new MissionList(missions, reward);
        });
    }

    /**
     * Verifica se o nível foi concluído, ou seja, se todas as missões da lista estão concluídas
     * @returns {boolean}
     */
    isCurrentLevelFinished() {
        if(this.missionsFinished)
            return false;

        const currentMissionList = this.missionLists[this.currentLevel];
        return currentMissionList.isMissionListFinished();
    }

    /**
     * Avança para o próximo nível, caso o nível atual tenha sido concluído
     */
    advanceLevel() {
        if (this.isCurrentLevelFinished()) {
            const reward = this.missionLists[this.currentLevel].reward
            window.game.city.money += reward;
            window.ui.notify('moneyGive',`Parabéns! Subiste de Nível: +${reward}$`);
            // Avançar para o próximo nível, se o atual foi completado
            if (this.currentLevel < this.missionLists.length - 1) {
                this.currentLevel++;
            } else {
                this.missionsFinished = true;
                window.ui.notify('success','Parabéns! Concluiste as Missões!');
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

    /**
     * Retorna uma lista das missões atuais
     * @returns {MissionList}
     */
    getCurrentMissions() {
        const currentMissionList = this.missionLists[this.currentLevel];
        return currentMissionList
    }
}

