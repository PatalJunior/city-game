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
    y: 'top',
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
    document.getElementById('city-money').innerHTML = game.city.money+"$";
    document.getElementById('city-level').innerHTML = "Nível: "+game.city.level+" ("+game.city.missionCounter+"/"+Object.keys(game.city.levels[game.city.level]).length+")";

    const missionContainer = document.getElementById('missions-container');
    missionContainer.innerHTML = "";

    for (const key of Object.keys(game.city.levels[game.city.level])) {
      const mission = game.city.levels[game.city.level][key];
      const missionDiv = document.createElement('div');

      const missionIcon = document.createElement('i');
      missionIcon.classList.add('missions-container-text');
      if (mission.done) {
        missionIcon.classList.add('fas', 'fa-check');
        missionIcon.style.color = '#02CC16';
      } else {
        missionIcon.classList.add('fas', 'fa-times');
        missionIcon.style.color = '#B51504';
      }

      const missionText = document.createElement('span');
      missionText.classList.add('missions-container-text');
      missionText.textContent = mission.mission + " - ";

      missionText.appendChild(missionIcon);

      missionDiv.appendChild(missionText);
      missionContainer.appendChild(missionDiv);
    }


    const date = new Date('1/1/2023');
    date.setDate(date.getDate() + game.city.simTime);
    document.getElementById('sim-time').innerHTML = date.toLocaleDateString();
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
window.notyf = notyf
window.ui = new GameUI();