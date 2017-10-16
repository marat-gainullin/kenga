import Color from './color';
import Cursor from './cursor';
import Font from './font';
import Invoke from 'septima-utils/invoke';

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
    let left = 0;
    let curr = elem;
    // This intentionally excludes body which has a null offsetParent.
    while (curr.offsetParent) {
        left -= curr.scrollLeft;
        curr = curr.parentNode;
    }
    while (elem) {
        left += elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return left;
}

function absoluteTop(elem) {
    let top = 0;
    let curr = elem;
    // This intentionally excludes body which has a null offsetParent.
    while (curr.offsetParent) {
        top -= curr.scrollTop;
        curr = curr.parentNode;
    }
    while (elem) {
        top += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return top;
}

function on(element, eventName, handler, capturePhase) {
    element.addEventListener(eventName, handler, !!capturePhase);
    return {
        removeHandler: function() {
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

const module = {};
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
    get: function() {
        return on;
    }
});
Object.defineProperty(module, 'Events', {
    get: function() {
        return Events;
    }
});
Object.defineProperty(module, 'absoluteLeft', {
    get: function() {
        return absoluteLeft;
    }
});
Object.defineProperty(module, 'absoluteTop', {
    get: function() {
        return absoluteTop;
    }
});

((() => {
    let menuSession = null;
    let mouseDownReg = null;

    function startMenuSession(menu) {
        function isOutsideOfAnyMenu(anElement) {
            let currentElement = anElement;
            while (currentElement !== null && !currentElement.className.includes('p-menu') && currentElement !== document.body)
                currentElement = currentElement.parentElement;
            return currentElement === document.body || currentElement === null;
        }

        if (menuSession !== menu) {
            if (menuSession) {
                menuSession.close();
            }
            menuSession = menu;
            mouseDownReg = on(document, Events.MOUSEDOWN, evt => {
                if (isOutsideOfAnyMenu(evt.target)) {
                    evt.stopPropagation();
                    closeMenuSession();
                }
            }, true);
        }
    }

    function closeMenuSession() {
        if (menuSession) {
            mouseDownReg.removeHandler();
            menuSession.close();
            menuSession = null;
        }
    }

    function isMenuSession() {
        return !!menuSession;
    }

    Object.defineProperty(module, 'startMenuSession', {
        get: function() {
            return startMenuSession;
        }
    });
    Object.defineProperty(module, 'closeMenuSession', {
        get: function() {
            return closeMenuSession;
        }
    });
    Object.defineProperty(module, 'isMenuSession', {
        get: function() {
            return isMenuSession;
        }
    });
})());
export default module;