/** 
 * Gere a entrada do rato e do teclado
 */
export class InputManager {
  /**
   * Última posição do rato
   * @type {x: number, y: number}
   */
  mouse = { x: 0, y: 0 };
  /**
   * Botão esquerdo do rato está a ser premido
   * @type {boolean}
   */
  isLeftMouseDown = false;
  /**
   * Botão do meio do rato está a ser premido
   * @type {boolean}
   */
  isMiddleMouseDown = false;
  /**
   * Botão direito do rato está a ser premido
   * @type {boolean}
   */
  isRightMouseDown = false;

  constructor() {
    window.ui.gameWindow.addEventListener('mousedown', this.#onMouseDown.bind(this), false);
    window.ui.gameWindow.addEventListener('mouseup', this.#onMouseUp.bind(this), false);
    window.ui.gameWindow.addEventListener('mousemove', this.#onMouseMove.bind(this), false);
    window.ui.gameWindow.addEventListener('contextmenu', (event) => event.preventDefault(), false);
  }

  /**
   * Controlo do evento 'mousedown'
   * @param {MouseEvent} event 
   */
  #onMouseDown(event) {
    if (event.button === 0) {
      this.isLeftMouseDown = true;
    }
    if (event.button === 1) {
      this.isMiddleMouseDown = true;
    }
    if (event.button === 2) {
      this.isRightMouseDown = true;
    }
  }

  /**
   * Controlo do evento 'mouseup'
   * @param {MouseEvent} event 
   */
  #onMouseUp(event) {
    if (event.button === 0) {
      this.isLeftMouseDown = false;
    }
    if (event.button === 1) {
      this.isMiddleMouseDown = false;
    }
    if (event.button === 2) {
      this.isRightMouseDown = false;
    }
  }

  /**
   * Controlo do evento 'mousemove'
   * @param {MouseEvent} event 
   */
  #onMouseMove(event) {
    this.isLeftMouseDown = event.buttons & 1;
    this.isRightMouseDown = event.buttons & 2;
    this.isMiddleMouseDown = event.buttons & 4;
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }
}