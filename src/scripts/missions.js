import { MissionType } from "./sim/missions/missionType"
export var missions = [
    [
        {
            missionType: MissionType.road,
            missionDescription: 'Construa 5 estradas',
            missionObjectiveCount: 5,
            eventName: 'roadBuilt'
        },
        {
            missionType: MissionType.residential,
            missionDescription: 'Construa 5 residencias',
            missionObjectiveCount: 5,
            eventName: 'residenceBuilt'
        },
        {
            missionType: MissionType.resident,
            missionDescription: 'Obtenha 30 residentes',
            missionObjectiveCount: 30,
            eventName: 'newResident'
        },
    ],
    [
        {
            missionType: MissionType.road,
            missionDescription: 'Construa 10 estradas',
            missionObjectiveCount: 10,
            eventName: 'roadBuilt'
        },
        {
            missionType: MissionType.residential,
            missionDescription: 'Construa 10 residencias',
            missionObjectiveCount: 10,
            eventName: 'residenceBuilt'
        },
        {
            missionType: MissionType.resident,
            missionDescription: 'Obtenha 60 residentes',
            missionObjectiveCount: 60,
            eventName: 'newResident'
        },
    ],
    [
        {
            missionType: MissionType.road,
            missionDescription: 'Construa 20 estradas',
            missionObjectiveCount: 20,
            eventName: 'roadBuilt'
        },
        {
            missionType: MissionType.residential,
            missionDescription: 'Construa 15 residencias',
            missionObjectiveCount: 15,
            eventName: 'residenceBuilt'
        },
        {
            missionType: MissionType.resident,
            missionDescription: 'Obtenha 100 residentes',
            missionObjectiveCount: 100,
            eventName: 'newResident'
        },
    ],
]
