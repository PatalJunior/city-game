import { Mission } from "./mission";

export class MissionList {
    /**
     * Missões a concluir, para terminar a "quest line"
     * @type {Array[Mission]}
     */
    missionList = [];

    /**
     * Premio a ganhar ao terminar a "quest line"
     * @type {Integer}
     */
    reward;

    /**
     * Construtor que inicializa a lista de missões
     * @param {Array} missionData - Dados das missões a serem adicionadas
     */
    constructor(missionData, reward) {
        // console.log("Constructor")
        // console.log(missionData, reward)
        if (Array.isArray(missionData)) {
            this.missionList = missionData.map(data => new Mission(
                data.missionType,
                data.missionDescription,
                data.missionObjectiveCount,
                data.eventName
            ));

            this.reward = reward
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
