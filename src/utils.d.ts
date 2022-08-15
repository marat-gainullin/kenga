declare namespace Utils {
  function isPopupSession(): boolean;
  function isMenuSession(): boolean;
  function startMenuSession(): void;
  function startPopupSession(): void;
  function closeMenuSession(): void;
  function closePopupSession(): void;

  function next(): number;
  function nextExtended(): string;
  function later(action: () => void): void;
  function delayed(timeout: number, action: () => void): void;
  function throttle(timeout: number, action: () => void): void;

  function on(element: HTMLElement, eventName: string, handler: (evt: Event) => void, capturePhase?: boolean): { removeHandler: () => void };

  function selectFile(onSelection: (selected: File) => void, fileFilter: string): void;
  function selectColor(onSelection: (selected: any) => void, oldValue: any): void;

  enum Cursor {
    CROSSHAIR = "crosshair",
    DEFAULT = "default",
    AUTO = "auto",
    E_RESIZE = "e-resize",
    // help ?
    // progress ?
    HAND = "pointer",
    MOVE = "move",
    NE_RESIZE = "ne-resize",
    NW_RESIZE = "nw-resize",
    N_RESIZE = "n-resize",
    SE_RESIZE = "se-resize",
    SW_RESIZE = "sw-resize",
    S_RESIZE = "s-resize",
    TEXT = "text",
    WAIT = "wait",
    W_RESIZE = "w-resize"
  }

  enum Events {
    BLUR = 'blur',
    CANPLAYTHROUGH = 'canplaythrough',
    CHANGE = 'change',
    CLICK = 'click',
    CONTEXTMENU = 'contextmenu',
    DBLCLICK = 'dblclick',
    DRAG = 'drag',
    DRAGEND = 'dragend',
    DRAGENTER = 'dragenter',
    DRAGLEAVE = 'dragleave',
    DRAGOVER = 'dragover',
    DRAGSTART = 'dragstart',
    DROP = 'drop',
    ENDED = 'ended',
    ERROR = 'error',
    FOCUS = 'focus',
    FOCUSIN = 'focusin',
    FOCUSOUT = 'focusout',
    GESTURECHANGE = 'gesturechange',
    GESTUREEND = 'gestureend',
    GESTURESTART = 'gesturestart',
    INPUT = 'input',
    KEYDOWN = 'keydown',
    KEYPRESS = 'keypress',
    KEYUP = 'keyup',
    LOAD = 'load',
    LOADEDMETADATA = 'loadedmetadata',
    LOSECAPTURE = 'losecapture',
    MOUSEDOWN = 'mousedown',
    MOUSEMOVE = 'mousemove',
    MOUSEOUT = 'mouseout',
    MOUSEOVER = 'mouseover',
    MOUSEUP = 'mouseup',
    MOUSEWHEEL = 'mousewheel',
    PROGRESS = 'progress',
    SCROLL = 'scroll',
    TOUCHCANCEL = 'touchcancel',
    TOUCHEND = 'touchend',
    TOUCHMOVE = 'touchmove',
    TOUCHSTART = 'touchstart'
  }

  enum Orientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
  }

  enum VerticalPosition {
    CENTER = 'center',
    TOP = 'top',
    BOTTOM = 'bottom'
  }

  enum VerticalAlign {
    CENTER = 'center',
    TOP = 'top',
    BOTTOM = 'bottom',
    FIT = 'fit'
  }

  enum HorizontalPosition {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right'
  }

  enum HorizontalAlign {
    CENTER = 'center',
    LEFT = 'left',
    RIGHT = 'right',
    FIT = 'fit'
  }

  enum ScrollBarPolicy {
    ALLWAYS = 'allways',
    NEVER = 'never',
    AUTO = 'auto'
  }
}

export default Utils;
