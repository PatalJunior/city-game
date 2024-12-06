import { Game } from './game';
import { SimObject } from './sim/simObject';
import playIconUrl from '/icons/play-color.png';
import pauseIconUrl from '/icons/pause-color.png';

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
   * Música de Background
  */
  backgroundMusic = new Audio('/sounds/background.mp3');

  /**
   * Tipos de Notificação
  */
  NotifyTypes = {
    inform: {
      icon: 'fas fa-info-circle',
      background: '#1b1d21',
      textColor: 'white',
      iconColor: 'white',
    },
    error: {
      icon: 'fas fa-times-circle',
      background: '#6b2424',
      textColor: 'white',
      iconColor: 'white',
    },
    success: {
      icon: 'fas fa-check-circle',
      background: '#246b4d',
      textColor: 'white',
      iconColor: 'white',
    },
    moneyTake: {
      icon: 'fas fa-receipt',
      background: '#9c0902',
      textColor: 'white',
      iconColor: 'white',
    },
    moneyGive: {
      icon: 'fas fa-hand-holding-usd',
      background: '#33c930',
      textColor: 'white',
      iconColor: 'white',
    }
  };

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
   * Atualiza os valores na barra de título
   * @param {Game} game 
   */
  updateTitleBar(game) {
    document.getElementById('city-name').innerHTML = game.city.name;
    document.getElementById('population-counter').innerHTML = game.city.population;
    document.getElementById('city-money').innerHTML = game.city.money+"$";

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
  notify(data) {
    var id = 'notify_' + Math.floor(Math.random()*(1000-1+1)+1).toString();
    const notiType = this.NotifyTypes[data.type]

    $('#notifications-container').append(`
        <div class="notification" id="${id}">
            <div class="icon" id="icon_${id}">
                <i class="${notiType.icon} icon"></i>
            </div>
            <div class="message" id="message_${id}">
                ${data.message}
            </div>
        </div>
    `)
    
    $('#'+id).css('background-color', notiType.background)
    $('#message_'+id).css('color', notiType.textColor)
    $('#icon_'+id).css('color', notiType.iconColor)
    $('#'+id).css('display', 'flex')
    $('#'+id).addClass('slide-anim-in')

    setTimeout(() => {
        $('#'+id).addClass('slide-anim-out')
        setTimeout(()=>{$("#"+id).remove()}, 1500)
    }, 1500)
  }
}

window.ui = new GameUI();