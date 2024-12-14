import { Game } from './game';
import { SimObject } from './sim/simObject';
import playIconUrl from '/icons/play-color.png';
import pauseIconUrl from '/icons/pause-color.png';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte



var notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'left',
    y: 'center',
  },
  types: [
    {
      type: 'inform',
      background: '#1b1d21',
      icon: {
        className: 'fas fa-info-circle',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'error',
      background: '#6b2424',
      icon: {
        className: 'fas fa-times-circle',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'success',
      background: '#246b4d',
      icon: {
        className: 'fas fa-check-circle',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'moneyTake',
      background: '#9c0902',
      icon: {
        className: 'fas fa-receipt',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'moneyGive',
      className: 'moneyGiveToast', // Exemplo com classe css
      icon: {
        className: 'fas fa-hand-holding-usd',
        tagName: 'i',
        color: 'white'
      }
    },
  ]
});

export class GameUI {
  /**
   * Ferramenta selecionada
   * @type {string}
   */
  activeToolId = 'select';
  /**
   * @type {HTMLElement | null }
   */
  selectedControl = document.getElementById('button-select');
  /**
   * Estado do jogo, pausado, retomado
   * @type {boolean}
   */
  isPaused = false;

  /**
   * Estado do jogo, não concluido, concluido
   * @type {boolean}
   */
  isFinished = false;

  /**
   * Música de Background
  */
  backgroundMusic = new Audio('/sounds/background.mp3');

  /**
   * Tipos de Notificação
  */


  get gameWindow() {
    return document.getElementById('render-target');
  }

  showLoadingText() {
    document.getElementById('loading').style.visibility = 'visible';
  }

  hideLoadingText() {
    document.getElementById('loading').style.visibility = 'hidden';
  }

  /**
   * 
   * @param {*} event 
   */
  onToolSelected(event) {
    // Desmarca o botão anteriormente selecionado e selecione este
    if (this.selectedControl) {
      this.selectedControl.classList.remove('selected');
    }
    this.selectedControl = event.target;
    this.selectedControl.classList.add('selected');

    this.activeToolId = this.selectedControl.getAttribute('data-type');
  }

  /**
   * Altera o estado de pausa do jogo
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      document.getElementById('pause-button-icon').src = playIconUrl;
      document.getElementById('paused-text').style.visibility = 'visible';
    } else {
      document.getElementById('pause-button-icon').src = pauseIconUrl;
      document.getElementById('paused-text').style.visibility = 'hidden';
    }
  }

  /**
   * Altera o estado de pausa do jogo
   */
  toggleFinished() {
    this.isFinished = !this.isFinished;
    if (this.isFinished) {
      document.getElementById('finished-text').style.visibility = 'visible';
    } else {
      document.getElementById('finished-text').style.visibility = 'hidden';
    }
  }

  /**
   * Atualiza os valores na barra de título
   * @param {Game} game 
   */
  updateTitleBar(game) {
    document.getElementById('city-name').innerHTML = game.city.name;
    document.getElementById('population-counter').innerHTML = game.city.population;
    document.getElementById('city-money').innerHTML = game.city.money + "$";
    document.getElementById('city-level').innerHTML = "Nível: " + (game.city.missionLevel.currentLevel + 1) + " (" + (game.city.missionLevel.currentLevel + 1) + "/" + (game.city.missionLevel.missionLists.length) + ")";



    const date = new Date('1/1/2023');
    date.setDate(date.getDate() + game.city.simTime);
    document.getElementById('sim-time').innerHTML = date.toLocaleDateString();
  }

  /**
   * Atualiza os valores no painel das quests
   * @param {Game} game 
   */
  updateQuestPanel(game) {

    const missionContainer = document.getElementById('missions-container');
    missionContainer.innerHTML = "";
    const currentMissionsList = game.city.missionLevel.getCurrentMissions().missionList

    currentMissionsList.forEach(mission => {
      const missionDiv = document.createElement('div');
      const missionText = document.createElement('span');
      missionText.classList.add('missions-container-text');
      missionText.textContent = `${mission.missionDescription} (${mission._currentMissionObjectiveCount})` + " - ";

      const missionIcon = document.createElement('i');
      missionIcon.classList.add('missions-container-text');

      if (mission.isMissionFinished) {
        missionIcon.classList.add('fas', 'fa-check');
        missionIcon.style.color = '#02CC16';
      } else {
        missionIcon.classList.add('fas', 'fa-times');
        missionIcon.style.color = '#B51504';
      }


      missionText.appendChild(missionIcon);
      missionDiv.appendChild(missionText);
      missionContainer.appendChild(missionDiv);

    });

    missionContainer.classList.add('slide-anim-in')
    missionContainer.style.display = 'block' 

  }

  /**
   * Atualiza os valores no painel do timing
   * @param {Game} game 
   */
  updateTimingPanel(game) {
    const timingContainer = document.getElementById('timing-container');
    timingContainer.innerHTML = "";

    const currentMissions = game.city.missionLevel.getCurrentMissions();
    const time = currentMissions.missionFinishTime || performance.now() - currentMissions.missionStartTime;

    // Convert milliseconds into total seconds
    const totalSeconds = Math.floor(time / 1000); // Convert time to seconds
    const minutes = Math.floor(totalSeconds / 60); // Get the minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds

    // Format the time as MM:SS or 0:SS if less than a minute
    let formattedTime;
    if (minutes === 0) {
        formattedTime = `0:${seconds.toString().padStart(2, '0')}`; // Show 0:SS if less than a minute
    } else {
        formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`; // Otherwise show MM:SS
    }

    const timingDiv = document.createElement('div');
    const timingText = document.createElement('span');
    timingText.classList.add('timing-container-text');
    timingText.textContent = `Time: ${formattedTime}`; // Show "Time: MM:SS" or "Time: 0:SS"

    timingDiv.appendChild(timingText);
    timingContainer.appendChild(timingDiv);

    // Apply animation and show the container if there is any time
    if (time) {
        timingContainer.classList.add('slide-anim-in');
        timingContainer.style.display = 'block';
    }
}



  /**
   * Atualiza o painel de info com as infos do objeto
   * @param {SimObject} object 
   */
  updateInfoPanel(object) {
    const infoElement = document.getElementById('info-panel')
    if (object) {
      infoElement.style.visibility = 'visible';
      infoElement.innerHTML = object.toHTML();
    } else {
      infoElement.style.visibility = 'hidden';
      infoElement.innerHTML = '';
    }
  }

  PlayBackgroundMusic(status) {
    if (status) {
      this.backgroundMusic.play();
      this.backgroundMusic.volume = 0.25;
    } else {
      this.backgroundMusic.stop();
    }
  }

  soundEffect(file) {
    const sound = new Audio(`/sounds/${file}.mp3`);
    sound.volume = 0.25;
    sound.play();
  }

  /**
   * Sistema de Notificações
  */
  /**
   * Sistema de Notificações
   */
  notify(type, message) {
    notyf.open({
      type: type,
      message: message,
    });
  }
}

window.ui = new GameUI();