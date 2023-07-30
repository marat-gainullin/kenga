import Color from './color';
import Cursor from './cursor';
import Font from './font';

const global = window;
const Events = {
    BLUR: 'blur',
    CANPLAYTHROUGH: 'canplaythrough',
    CHANGE: 'change',
    CLICK: 'click',
    CONTEXTMENU: 'contextmenu',
    DBLCLICK: 'dblclick',
    DRAG: 'drag',
    DRAGEND: 'dragend',
    DRAGENTER: 'dragenter',
    DRAGLEAVE: 'dragleave',
    DRAGOVER: 'dragover',
    DRAGSTART: 'dragstart',
    DROP: 'drop',
    ENDED: 'ended',
    ERROR: 'error',
    FOCUS: 'focus',
    FOCUSIN: 'focusin',
    FOCUSOUT: 'focusout',
    GESTURECHANGE: 'gesturechange',
    GESTUREEND: 'gestureend',
    GESTURESTART: 'gesturestart',
    INPUT: 'input',
    KEYDOWN: 'keydown',
    KEYPRESS: 'keypress',
    KEYUP: 'keyup',
    LOAD: 'load',
    LOADEDMETADATA: 'loadedmetadata',
    LOSECAPTURE: 'losecapture',
    MOUSEDOWN: 'mousedown',
    MOUSEMOVE: 'mousemove',
    MOUSEOUT: 'mouseout',
    MOUSELEAVE: 'mouseleave',
    MOUSEOVER: 'mouseover',
    MOUSEUP: 'mouseup',
    MOUSEWHEEL: 'mousewheel',
    PROGRESS: 'progress',
    SCROLL: 'scroll',
    TOUCHCANCEL: 'touchcancel',
    TOUCHEND: 'touchend',
    TOUCHMOVE: 'touchmove',
    TOUCHSTART: 'touchstart'
};

function absoluteLeft(elem) {
    return elem.getBoundingClientRect().x;
}

function absoluteTop(elem) {
  return elem.getBoundingClientRect().y;
}

function on(element, eventName, handler, capturePhase) {
    element.addEventListener(eventName, handler, !!capturePhase);
    return {
        removeHandler: function () {
            element.removeEventListener(eventName, handler, !!capturePhase);
        }
    };
}

const Orientation = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical'
};
const VerticalPosition = {
    CENTER: 'center',
    TOP: 'top',
    BOTTOM: 'bottom'
};
const HorizontalPosition = {
    CENTER: 'center',
    LEFT: 'left',
    RIGHT: 'right'
};
const FontStyle = Font.Style;
const ScrollBarPolicy = {
    ALLWAYS: 'allways',
    NEVER: 'never',
    AUTO: 'auto'
};

function selectFile(onSelection, fileFilter) {
    const fileField = document.createElement('input');
    fileField.type = 'file';
    if (fileFilter)
        fileField.accept = fileFilter;
    on(fileField, 'change', () => {
        if (fileField.files.length === 1)
            onSelection(fileField.files[0]);
        else
            onSelection(fileField.files);
    });
    fileField.click();
    return fileField;
}

function selectColor(onSelection, oldValue) {
    const colorField = document.createElement('input');
    colorField.type = 'color';
    if (oldValue)
        colorField.value = `${oldValue}`;
    on(colorField, 'change', () => {
        onSelection(new Color(colorField.value));
    });
    colorField.click();
    return colorField;
}

function later(action) {
    const timeout = setTimeout(function () {
        clearTimeout(timeout);
        action();
    }, 0);
}

function delayed(timeout, action) {
    if (arguments.length < 2)
        throw 'Ui.delayed needs 2 arguments (timeout, action).';
    const timeoutCookie = setTimeout(function () {
        clearTimeout(timeoutCookie);
        action();
    }, +timeout);
}

const throttle = ((() => {
    let watchdog = null;

    function _throttle(timeout, action) {
        if (arguments.length < 2)
            throw "Missing Ui.throttle 'action' argument";
        if (arguments.length < 1)
            throw "Missing Ui.throttle 'timeout' argument";

        function invoked() {
            watchdog = null;
            action();
        }

        if (timeout < 1) { // ms
            action()
        } else {
            if (!watchdog) {
                delayed(timeout, invoked);
                watchdog = invoked;
            }
        }
    }

    return _throttle;
})());

function now() {
    return new Date().valueOf();
}

const COUNTER_DIGITS = 100;
let ID = now() * COUNTER_DIGITS;

const LONG_COUNTER_DIGITS = 1000000;
let LONG_ID = now() * LONG_COUNTER_DIGITS;

function next() {
    const idMillis = Math.floor(ID / COUNTER_DIGITS);
    if (idMillis === now()) {
        const oldCounter = ID - idMillis * COUNTER_DIGITS;
        const newCounter = oldCounter + 1;
        if (newCounter === COUNTER_DIGITS) {
            // Spin with maximum duration of one millisecond ...
            let newMillis;
            do {
                newMillis = now();
            } while (newMillis === idMillis);
            ID = newMillis * COUNTER_DIGITS;
        } else {
            ID = idMillis * COUNTER_DIGITS + newCounter;
        }
    } else {
        ID = now() * COUNTER_DIGITS;
    }
    return ID;
}

function nextExtended() {
    const idMillis = Math.floor(LONG_ID / LONG_COUNTER_DIGITS);
    if (idMillis === now()) {
        const oldCounter = LONG_ID - idMillis * LONG_COUNTER_DIGITS;
        const newCounter = oldCounter + 1;
        if (newCounter === LONG_COUNTER_DIGITS) {
            // Spin with maximum duration of one millisecond ...
            let newMillis;
            do {
                newMillis = now();
            } while (newMillis === idMillis);
            LONG_ID = newMillis * LONG_COUNTER_DIGITS;
        } else {
            LONG_ID = idMillis * LONG_COUNTER_DIGITS + newCounter;
        }
    } else {
        LONG_ID = now() * LONG_COUNTER_DIGITS;
    }
    return '' + LONG_ID;
}

const module = {};
Object.defineProperty(module, 'next', {
    enumerable: true,
    value: next
});

Object.defineProperty(module, 'nextExtended', {
    enumerable: true,
    value: nextExtended
});
Object.defineProperty(module, 'later', {
    enumerable: true,
    value: later
});
Object.defineProperty(module, 'delayed', {
    enumerable: true,
    value: delayed
});
Object.defineProperty(module, 'throttle', {
    enumerable: true,
    value: throttle
});
Object.defineProperty(module, 'Colors', {
    enumerable: true,
    value: Color
});
Object.defineProperty(module, 'Color', {
    enumerable: true,
    value: Color
});
Object.defineProperty(module, 'Cursor', {
    enumerable: true,
    value: Cursor
});
Object.defineProperty(module, 'Font', {
    enumerable: true,
    value: Font
});
Object.defineProperty(module, 'selectFile', {
    enumerable: true,
    value: selectFile
});
Object.defineProperty(module, 'selectColor', {
    enumerable: true,
    value: selectColor
});
Object.defineProperty(module, 'msgBox', {
    enumerable: true,
    value: global.alert
});
Object.defineProperty(module, 'error', {
    enumerable: true,
    value: global.alert
});
Object.defineProperty(module, 'warn', {
    enumerable: true,
    value: global.alert
});
Object.defineProperty(module, 'HorizontalPosition', {
    enumerable: true,
    value: HorizontalPosition
});
Object.defineProperty(module, 'VerticalPosition', {
    enumerable: true,
    value: VerticalPosition
});
Object.defineProperty(module, 'Orientation', {
    enumerable: true,
    value: Orientation
});
Object.defineProperty(module, 'ScrollBarPolicy', {
    enumerable: true,
    value: ScrollBarPolicy
});
Object.defineProperty(module, 'FontStyle', {
    enumerable: true,
    value: FontStyle
});

Object.defineProperty(module, 'on', {
    get: function () {
        return on;
    }
});
Object.defineProperty(module, 'Events', {
    get: function () {
        return Events;
    }
});
Object.defineProperty(module, 'absoluteLeft', {
    get: function () {
        return absoluteLeft;
    }
});
Object.defineProperty(module, 'absoluteTop', {
    get: function () {
        return absoluteTop;
    }
});

((() => {
    let popupSession = null;
    let mouseDownReg = null;

    function startPopupSession(popup) {
        function isOutsideOfAnyPopup(anElement) {
            let currentElement = anElement;
            while (
                currentElement !== null && currentElement !== document.body &&
                !currentElement.classList.contains('p-menu') && !currentElement.classList.contains('p-popup')
                )
                currentElement = currentElement.parentElement;
            return currentElement === document.body || currentElement === null;
        }

        if (popupSession !== popup) {
            closePopupSession();
            popupSession = popup;
            mouseDownReg = on(document, Events.MOUSEDOWN, evt => {
                if (isOutsideOfAnyPopup(evt.target)) {
                    closePopupSession();
                }
            }, true);
        }
    }

    function closePopupSession() {
        if (popupSession) {
            popupSession.close();
            popupSession = null;
        }
        if (mouseDownReg) {
            mouseDownReg.removeHandler();
            mouseDownReg = null;
        }
    }

    function isPopupSession() {
        return !!popupSession;
    }

    Object.defineProperty(module, 'startMenuSession', {
        get: function () {
            return startPopupSession;
        }
    });
    Object.defineProperty(module, 'startPopupSession', {
        get: function () {
            return startPopupSession;
        }
    });
    Object.defineProperty(module, 'closeMenuSession', {
        get: function () {
            return closePopupSession;
        }
    });
    Object.defineProperty(module, 'closePopupSession', {
        get: function () {
            return closePopupSession;
        }
    });
    Object.defineProperty(module, 'isMenuSession', {
        get: function () {
            return isPopupSession;
        }
    });
    Object.defineProperty(module, 'isPopupSession', {
        get: function () {
            return isPopupSession;
        }
    });
})());
export default module;
