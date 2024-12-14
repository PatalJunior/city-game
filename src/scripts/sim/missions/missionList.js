import { Mission } from "./mission";

export class MissionList {
    /**
     * Missões a concluir, para terminar a "quest line"
     * @type {Array[Mission]}
     */
    #missionList = [];

    get missionList() {
        if (!this.missionStartTime)
            this.startTimingMission();

        return this.#missionList;
    }

    /**
     * Premio a ganhar ao terminar a "quest line"
     * @type {Integer}
     */
    reward;

    /**
     * Data de inicio das missões atuais
     * @type {DOMHighResTimeStamp}
     */
    missionStartTime;

    /**
     * Data de termino das s atuais
     * @type {DOMHighResTimeStamp}
     */
    missionFinishTime;


    /**
     * Construtor que inicializa a lista de missões
     * @param {Array} missionData - Dados das missões a serem adicionadas
     */
    constructor(missionData, reward) {
        // console.log("Constructor")
        // console.log(missionData, reward)
        if (Array.isArray(missionData)) {
            this.#missionList = missionData.map(data => new Mission(
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
        for (let i = 0; i < this.#missionList.length; i++) {
            const mission = this.#missionList[i];

            if (!mission.isMissionFinished)
                return false;
        }

        return true;
    }

    startTimingMission() {
        this.missionStartTime = performance.now();
        window.addEventListener('missionFinished', this.missionFinishedEventHandler)
    }

    missionFinishedEventHandler() {
        if (window.game.city.missionLevel.currentMissionList.isMissionListFinished()){
            console.log("handler")
            window.game.city.missionLevel.currentMissionList.missionFinishTime = performance.now();
            window.removeEventListener('missionFinished', this.missionFinishedEventHandler)
        }
    }

}
