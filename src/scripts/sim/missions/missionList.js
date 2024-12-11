import { Mission } from "./mission";

export class MissionList {
    /**
     * Missões a concluir, para terminar a "quest line"
     * @type {Array[Mission]}
     */
    missionList = [];

    /**
     * Construtor que inicializa a lista de missões
     * @param {Array} missionData - Dados das missões a serem adicionadas
     */
    constructor(missionData) {
        if (Array.isArray(missionData)) {
            this.missionList = missionData.map(data => new Mission(
                data.missionType,
                data.missionDescription,
                data.missionObjectiveCount,
                data.eventName
            ));
        }
    }

    /**
     * A "quest line" está completada?
     * @type {boolean}
     */
    isMissionListFinished() {
        for (let i = 0; i < this.missionList.length; i++) {
            const mission = this.missionList[i];

            if (!mission.isMissionFinished)
                return false;
        }

        return true;
    }
}
