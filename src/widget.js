import Invoke from 'septima-utils/invoke';
import Ui from './utils';
import MouseEvent from './events/mouse-event';
import WidgetEvent from './events/widget-event';
import ActionEvent from './events/action-event';

class Widget {
    constructor(box, shell) {
        
        box = box || document.createElement('div');
        shell = shell || box;

        if (shell !== box)
            shell.appendChild(box);

        const self = this;

        shell['p-widget'] = this;
        shell.classList.add('p-widget');

        let parent;
        let visibleDisplay = 'inline-block';
        let contextMenu;
        let enabled = true;
        let name;
        let background;
        let foreground;
        let opaque = true;
        let cursor;
        let toolTipText;
        let focusable = false;
        let font = null;

        Object.defineProperty(this, 'visibleDisplay', {
            get: function () {
                return visibleDisplay;
            },
            set: function (aValue) {
                visibleDisplay = aValue;
            }
        });
        Object.defineProperty(this, 'parent', {
            get: function () {
                return parent;
            },
            set: function (aValue) {
                parent = aValue;
            }
        });
        Object.defineProperty(this, 'element', {
            get: function () {
                return shell;
            }
        });

        Object.defineProperty(this, 'enabled', {
            get: function () {
                return enabled;
            },
            set: function (aValue) {
                if (enabled !== aValue) {
                    enabled = aValue;
                    if (enabled)
                        box.removeAttribute('disabled');
                    else
                        box.setAttribute('disabled', '');
                }
            }
        });
        Object.defineProperty(this, 'name', {
            get: function () {
                return name;
            },
            set: function (aValue) {
                name = aValue;
                self.element.name = name;
            }
        });
        Object.defineProperty(this, 'title', {
            get: function () {
                return box.title;
            },
            set: function (aValue) {
                box.title = aValue;
            }
        });
        Object.defineProperty(this, 'font', {
            get: function () {
                return font;
            },
            set: function (aValue) {
                if (font !== aValue) {
                    font = aValue;
                    if (font) {
                        shell.style.fontFamily = font.family;
                        shell.style.fontSize = `${font.size}pt`;
                        if (font.bold) {
                            shell.style.fontWeight = 'bold';
                        } else {
                            shell.style.fontWeight = 'normal';
                        }
                        if (font.italic) {
                            shell.style.fontStyle = 'italic';
                        } else {
                            shell.style.fontStyle = 'normal';
                        }
                    } else {
                        shell.style.fontFamily = '';
                        shell.style.fontSize = '';
                        shell.style.fontWeight = '';
                        shell.style.fontStyle = '';
                    }
                }
            }
        });

        function applyBackground() {
            if (opaque)
                box.style.backgroundColor = background && background.toStyled ? background.toStyled() : background;
            else
                box.style.background = 'none';
        }

        Object.defineProperty(this, 'opaque', {
            get: function () {
                return opaque;
            },
            set: function (aValue) {
                if (opaque !== aValue) {
                    opaque = aValue;
                    applyBackground();
                }
            }
        });
        Object.defineProperty(this, 'background', {
            get: function () {
                return background;
            },
            set: function (aValue) {
                if (background !== aValue) {
                    background = aValue;
                    applyBackground();
                }
            }
        });
        Object.defineProperty(this, 'foreground', {
            get: function () {
                return foreground;
            },
            set: function (aValue) {
                if (foreground !== aValue) {
                    foreground = aValue;
                    box.style.color = foreground && foreground.toStyled ? foreground.toStyled() : foreground;
                }
            }
        });
        Object.defineProperty(this, 'cursor', {
            get: function () {
                return cursor;
            },
            set: function (aValue) {
                cursor = aValue;
                box.style.cursor = cursor;
            }
        });

        let errorText = null;
        Object.defineProperty(this, 'error', {
            get: function () {
                if (errorText)
                    return errorText;
                else if (box.validationMessage)
                    return box.validationMessage;
                else
                    return null;
            },
            set: function (aValue) {
                if (self.error !== aValue) {
                    errorText = aValue;
                    if (box.setCustomValidity)
                        box.setCustomValidity(aValue !== null ? aValue : '');
                    if (aValue) {
                        if (self.showError)
                            self.showError();
                    } else {
                        if (self.hideError)
                            self.hideError();
                    }
                }
            }
        });
        Object.defineProperty(this, 'toolTipText', {
            get: function () {
                return toolTipText;
            },
            set: function (aValue) {
                if (toolTipText !== aValue) {
                    toolTipText = aValue;
                    box.title = toolTipText;
                }
            }
        });
        let tabIndex = 1;

        function applyTabIndex() {
            if (focusable) {
                box.setAttribute('tabindex', `${tabIndex}`);
            } else {
                box.removeAttribute('tabindex');
            }
        }
        Object.defineProperty(this, 'tabIndex', {
            get: function () {
                return tabIndex;
            },
            set: function (aValue) {
                if (!isNaN(aValue) && tabIndex !== aValue) {
                    tabIndex = aValue;
                    applyTabIndex();
                }
            }
        });
        Object.defineProperty(this, 'focusable', {
            get: function () {
                return focusable;
            },
            set: function (aValue) {
                if (focusable !== aValue) {
                    focusable = aValue;
                    applyTabIndex();
                }
            }
        });
        Object.defineProperty(this, "left", {
            get: function () {
                if (isAttached()) {
                    return shell.offsetLeft;
                } else {
                    const parsed = parseFloat(shell.style.left);
                    return isNaN(parsed) ? 0 : parsed;
                }
            },
            set: function (aValue) {
                if (aValue !== null) {
                    if (parent && parent.ajustLeft)
                        parent.ajustLeft(self, aValue);
                    else
                        shell.style.left = `${aValue}px`;
                } else {
                    shell.style.left = null;
                }
            }
        });
        Object.defineProperty(this, "top", {
            get: function () {
                if (isAttached()) {
                    return shell.offsetTop;
                } else {
                    const parsed = parseFloat(shell.style.top);
                    return isNaN(parsed) ? 0 : parsed;
                }
            },
            set: function (aValue) {
                if (aValue !== null) {
                    if (parent && parent.ajustTop)
                        parent.ajustTop(self, aValue);
                    else
                        shell.style.top = `${aValue}px`;
                } else {
                    shell.style.top = null;
                }
            }
        });
        Object.defineProperty(this, "width", {
            get: function () {
                if (isAttached())
                    return shell.offsetWidth;
                else {
                    const parsed = parseFloat(shell.style.width);
                    return isNaN(parsed) ? 0 : parsed;
                }
            },
            set: function (aValue) {
                if (aValue !== null) {
                    if (parent && parent.ajustWidth) {
                        parent.ajustWidth(self, aValue);
                    } else {
                        shell.style.width = `${aValue}px`;
                    }
                } else {
                    shell.style.width = null;
                }
            }
        });
        Object.defineProperty(this, "height", {
            get: function () {
                if (isAttached()) {
                    return shell.offsetHeight;
                } else {
                    const parsed = parseFloat(shell.style.height);
                    return isNaN(parsed) ? 0 : parsed;
                }
            },
            set: function (aValue) {
                if (aValue !== null) {
                    if (parent && parent.ajustHeight) {
                        parent.ajustHeight(self, aValue);
                    } else {
                        shell.style.height = `${aValue}px`;
                    }
                } else {
                    shell.style.height = null;
                }
            }
        });
        let menuTriggerReg = null;
        Object.defineProperty(this, 'contextMenu', {
            get: function () {
                return contextMenu;
            },
            set: function (aValue) {
                if (contextMenu !== aValue) {
                    if (menuTriggerReg) {
                        menuTriggerReg.removeHandler();
                        menuTriggerReg = null;
                    }
                    contextMenu = aValue;
                    if (contextMenu) {
                        menuTriggerReg = Ui.on(box, Ui.Events.CONTEXTMENU, event => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (contextMenu.showAt) {
                                Ui.startMenuSession(contextMenu);
                                const pageX = 'pageX' in event ? event.pageX : event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                                const pageY = 'pageY' in event ? event.pageY : event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                                contextMenu.showAt(pageX, pageY);
                            }
                        });
                    }
                }
            }
        });

        const actionHandlers = new Set();

        function addActionHandler(handler) {
            actionHandlers.add(handler);
            return {
                removeHandler: function () {
                    actionHandlers.delete(handler);
                }
            };
        }

        function fireAction() {
            const event = new ActionEvent(self);
            actionHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }

        const hideHandlers = new Set();

        function addHideHandler(handler) {
            hideHandlers.add(handler);
            return {
                removeHandler: function () {
                    hideHandlers.delete(handler);
                }
            };
        }

        const showHandlers = new Set();

        function addShowHandler(handler) {
            showHandlers.add(handler);
            return {
                removeHandler: function () {
                    showHandlers.delete(handler);
                }
            };
        }

        function addMouseClickHandler(handler) {
            const clickReg = Ui.on(shell, Ui.Events.CLICK, evt => {
                handler(new MouseEvent(self, evt, 1));
            });
            const dblClickReg = Ui.on(shell, Ui.Events.DBLCLICK, evt => {
                handler(new MouseEvent(self, evt, 2));
            });
            return {
                removeHandler: function () {
                    clickReg.removeHandler();
                    dblClickReg.removeHandler();
                }
            };
        }

        function addMousePressHandler(h) {
            return Ui.on(shell, Ui.Events.MOUSEDOWN, evt => {
                h(new MouseEvent(self, evt));
            });
        }

        function addMouseReleaseHandler(handler) {
            return Ui.on(shell, Ui.Events.MOUSEUP, evt => {
                handler(new MouseEvent(self, evt));
            });
        }

        function addMouseMoveHandler(handler) {
            return Ui.on(shell, Ui.Events.MOUSEMOVE, evt => {
                handler(new MouseEvent(self, evt));
            });
        }

        function addMouseEnterHandler(handler) {
            return Ui.on(shell, Ui.Events.MOUSEOVER, evt => {
                handler(new MouseEvent(self, evt));
            });
        }

        function addMouseExitHandler(handler) {
            return Ui.on(shell, Ui.Events.MOUSEOUT, evt => {
                handler(new MouseEvent(self, evt));
            });
        }

        function addMouseWheelHandler(handler) {
            return Ui.on(shell, Ui.Events.MOUSEWHEEL, evt => {
                handler(new MouseEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addActionHandler', {
            configurable: true,
            get: function () {
                return addActionHandler;
            }
        });
        Object.defineProperty(this, 'addHideHandler', {
            get: function () {
                return addHideHandler;
            }
        });
        Object.defineProperty(this, 'addShowHandler', {
            get: function () {
                return addShowHandler;
            }
        });
        Object.defineProperty(this, 'addMouseClickHandler', {
            get: function () {
                return addMouseClickHandler;
            }
        });
        Object.defineProperty(this, 'addMousePressHandler', {
            get: function () {
                return addMousePressHandler;
            }
        });
        Object.defineProperty(this, 'addMouseReleaseHandler', {
            get: function () {
                return addMouseReleaseHandler;
            }
        });
        Object.defineProperty(this, 'addMouseMoveHandler', {
            get: function () {
                return addMouseMoveHandler;
            }
        });
        Object.defineProperty(this, 'addMouseEnterHandler', {
            get: function () {
                return addMouseEnterHandler;
            }
        });
        Object.defineProperty(this, 'addMouseExitHandler', {
            get: function () {
                return addMouseExitHandler;
            }
        });
        Object.defineProperty(this, 'addMouseWheelHandler', {
            get: function () {
                return addMouseWheelHandler;
            }
        });

        Object.defineProperty(this, 'fireAction', {
            get: function () {
                return fireAction;
            }
        });

        function isAttached() {
            let cursorElement = shell;
            while (cursorElement && cursorElement !== document.body) {
                cursorElement = cursorElement.parentElement;
            }
            return !!cursorElement;
        }

        Object.defineProperty(this, 'attached', {
            get: function () {
                return isAttached();
            }
        });
        Object.defineProperty(this, 'visible', {
            get: function () {
                return shell.style.display !== 'none';
            },
            set: function (aValue) {
                const oldValue = self.visible;
                if (oldValue !== aValue) {
                    if (aValue) {
                        shell.style.display = visibleDisplay;
                    } else {
                        shell.style.display = 'none';
                    }
                    if (aValue) {
                        fireShown();
                    } else {
                        fireHidden();
                    }
                }
            }
        });

        function focus() {
            box.focus();
        }
        Object.defineProperty(this, 'focus', {
            get: function () {
                return focus;
            }
        });

        function blur() {
            box.blur();
        }
        Object.defineProperty(this, 'blur', {
            get: function () {
                return blur;
            }
        });

        function fireShown() {
            const event = new WidgetEvent(self);
            showHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }

        function fireHidden() {
            const event = new WidgetEvent(self);
            hideHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }

        let onAction;
        let actionReg;
        Object.defineProperty(this, 'onAction', {
            get: function () {
                return onAction;
            },
            set: function (aValue) {
                if (onAction !== aValue) {
                    if (actionReg) {
                        actionReg.removeHandler();
                        actionReg = null;
                    }
                    onAction = aValue;
                    if (onAction) {
                        actionReg = self.addActionHandler(event => {
                            if (onAction) {
                                onAction(event);
                            }
                        });
                    }
                }
            }
        });

        let onMouseExit;
        let mouseOutReg;
        Object.defineProperty(this, 'onMouseExit', {
            get: function () {
                return onMouseExit;
            },
            set: function (aValue) {
                if (onMouseExit !== aValue) {
                    if (mouseOutReg) {
                        mouseOutReg.removeHandler();
                        mouseOutReg = null;
                    }
                    onMouseExit = aValue;
                    if (onMouseExit) {
                        mouseOutReg = addMouseExitHandler(evt => {
                            if (onMouseExit) {
                                evt.event.stopPropagation();
                                onMouseExit(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseClick;
        let mouseClickReg;
        Object.defineProperty(this, 'onMouseClick', {
            get: function () {
                return onMouseClick;
            },
            set: function (aValue) {
                if (onMouseClick !== aValue) {
                    if (mouseClickReg) {
                        mouseClickReg.removeHandler();
                        mouseClickReg = null;
                    }
                    onMouseClick = aValue;
                    if (onMouseClick) {
                        mouseClickReg = addMouseClickHandler(evt => {
                            if (onMouseClick) {
                                evt.event.stopPropagation();
                                onMouseClick(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMousePress;
        let mousePressReg;
        Object.defineProperty(this, 'onMousePress', {
            get: function () {
                return onMousePress;
            },
            set: function (aValue) {
                if (onMousePress !== aValue) {
                    if (mousePressReg) {
                        mousePressReg.removeHandler();
                        mousePressReg = null;
                    }
                    onMousePress = aValue;
                    if (onMousePress) {
                        mousePressReg = addMousePressHandler(evt => {
                            if (onMousePress) {
                                evt.event.stopPropagation();
                                onMousePress(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseRelease;
        let mouseReleaseReg;
        Object.defineProperty(this, 'onMouseRelease', {
            get: function () {
                return onMouseRelease;
            },
            set: function (aValue) {
                if (onMouseRelease !== aValue) {
                    if (mouseReleaseReg) {
                        mouseReleaseReg.removeHandler();
                        mouseReleaseReg = null;
                    }
                    onMouseRelease = aValue;
                    if (onMouseRelease) {
                        mouseReleaseReg = addMouseReleaseHandler(evt => {
                            if (onMouseRelease) {
                                evt.event.stopPropagation();
                                onMouseRelease(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseEnter;
        let mouseEnterReg;
        Object.defineProperty(this, 'onMouseEnter', {
            get: function () {
                return onMouseEnter;
            },
            set: function (aValue) {
                if (onMouseEnter !== aValue) {
                    if (mouseEnterReg) {
                        mouseEnterReg.removeHandler();
                        mouseEnterReg = null;
                    }
                    onMouseEnter = aValue;
                    if (onMouseEnter) {
                        mouseEnterReg = addMouseEnterHandler(evt => {
                            if (onMouseEnter) {
                                evt.event.stopPropagation();
                                onMouseEnter(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseWheelMove;
        let mouseWheelReg;
        Object.defineProperty(this, 'onMouseWheelMove', {
            get: function () {
                return onMouseWheelMove;
            },
            set: function (aValue) {
                if (onMouseWheelMove !== aValue) {
                    if (mouseWheelReg) {
                        mouseWheelReg.removeHandler();
                        mouseWheelReg = null;
                    }
                    onMouseWheelMove = aValue;
                    if (onMouseWheelMove) {
                        mouseWheelReg = addMouseWheelHandler(evt => {
                            if (onMouseWheelMove) {
                                evt.event.stopPropagation();
                                onMouseWheelMove(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseMove;
        let mouseMoveReg;
        Object.defineProperty(this, 'onMouseMove', {
            get: function () {
                return onMouseMove;
            },
            set: function (aValue) {
                if (onMouseMove !== aValue) {
                    if (mouseMoveReg) {
                        mouseMoveReg.removeHandler();
                        mouseMoveReg = null;
                    }
                    onMouseMove = aValue;
                    if (onMouseMove) {
                        mouseMoveReg = addMouseMoveHandler(evt => {
                            if (onMouseMove) {
                                evt.event.stopPropagation();
                                onMouseMove(evt);
                            }
                        });
                    }
                }

            }
        });
        let onShow;
        let showReg;
        Object.defineProperty(this, 'onShow', {
            get: function () {
                return onShow;
            },
            set: function (aValue) {
                if (onShow !== aValue) {
                    if (showReg) {
                        showReg.removeHandler();
                        showReg = null;
                    }
                    onShow = aValue;
                    if (onShow) {
                        showReg = addShowHandler(event => {
                            if (onShow) {
                                onShow(event);
                            }
                        });
                    }
                }
            }
        });
        let onHide;
        let hideReg;
        Object.defineProperty(this, 'onHide', {
            get: function () {
                return onHide;
            },
            set: function (aValue) {
                if (onHide !== aValue) {
                    if (hideReg) {
                        hideReg.removeHandler();
                        hideReg = null;
                    }
                    onHide = aValue;
                    if (onHide) {
                        hideReg = addHideHandler(event => {
                            if (onHide) {
                                onHide(event);
                            }
                        });
                    }
                }
            }
        });
        let onFocus;
        let focusReg;
        Object.defineProperty(this, 'onFocus', {
            get: function () {
                return onFocus;
            },
            set: function (aValue) {
                if (onFocus !== aValue) {
                    if (focusReg) {
                        focusReg.removeHandler();
                        focusReg = null;
                    }
                    onFocus = aValue;
                    if (onFocus && self.addFocusHandler) {
                        focusReg = self.addFocusHandler(event => {
                            if (onFocus) {
                                onFocus(event);
                            }
                        });
                    }
                }
            }
        });
        let onFocusLost;
        let focusLostReg;
        Object.defineProperty(this, 'onFocusLost', {
            get: function () {
                return onFocusLost;
            },
            set: function (aValue) {
                if (onFocusLost !== aValue) {
                    if (focusLostReg) {
                        focusLostReg.removeHandler();
                        focusLostReg = null;
                    }
                    onFocusLost = aValue;
                    if (onFocusLost && self.addFocusLostHandler) {
                        focusLostReg = self.addFocusLostHandler(event => {
                            if (onFocusLost) {
                                onFocusLost(event);
                            }
                        });
                    }
                }
            }
        });
        let onKeyType;
        let keyTypeReg;
        Object.defineProperty(this, 'onKeyType', {
            get: function () {
                return onKeyType;
            },
            set: function (aValue) {
                if (onKeyType !== aValue) {
                    if (keyTypeReg) {
                        keyTypeReg.removeHandler();
                        keyTypeReg = null;
                    }
                    onKeyType = aValue;
                    if (onKeyType && self.addKeyTypeHandler) {
                        keyTypeReg = self.addKeyTypeHandler(event => {
                            if (onKeyType) {
                                event.event.stopPropagation();
                                onKeyType(event);
                            }
                        });
                    }
                }
            }
        });
        let onKeyPress;
        let keyPressReg;
        Object.defineProperty(this, 'onKeyPress', {
            get: function () {
                return onKeyPress;
            },
            set: function (aValue) {
                if (onKeyPress !== aValue) {
                    if (keyPressReg) {
                        keyPressReg.removeHandler();
                        keyPressReg = null;
                    }
                    onKeyPress = aValue;
                    if (onKeyPress && self.addKeyPressHandler) {
                        keyPressReg = self.addKeyPressHandler(event => {
                            if (onKeyPress) {
                                event.getEvent().stopPropagation();
                                onKeyPress(event);
                            }
                        });
                    }
                }
            }
        });
        let onKeyRelease;
        let keyReleaseReg;
        Object.defineProperty(this, 'onKeyRelease', {
            get: function () {
                return onKeyRelease;
            },
            set: function (aValue) {
                if (onKeyRelease !== aValue) {
                    if (keyReleaseReg) {
                        keyReleaseReg.removeHandler();
                        keyReleaseReg = null;
                    }
                    onKeyRelease = aValue;
                    if (onKeyRelease && self.addKeyReleaseHandler) {
                        keyReleaseReg = self.addKeyReleaseHandler(event => {
                            if (onKeyRelease) {
                                event.event.stopPropagation();
                                onKeyRelease(event);
                            }
                        });
                    }
                }
            }
        });
        let onSelect;
        let selectReg;
        Object.defineProperty(this, 'onSelect', {
            get: function () {
                return onSelect;
            },
            set: function (aValue) {
                if (onSelect !== aValue) {
                    if (selectReg) {
                        selectReg.removeHandler();
                        selectReg = null;
                    }
                    onSelect = aValue;
                    if (onSelect && self.addSelectHandler) {
                        selectReg = self.addSelectHandler(event => {
                            if (onSelect) {
                                onSelect(event);
                            }
                        });
                    }
                }
            }
        });
        let valueChange;
        let valueChangeReg;
        Object.defineProperty(this, 'onValueChange', {
            get: function () {
                return valueChange;
            },
            set: function (aValue) {
                if (valueChange !== aValue) {
                    if (valueChangeReg) {
                        valueChangeReg.removeHandler();
                        valueChangeReg = null;
                    }
                    valueChange = aValue;
                    if (valueChange && self.addValueChangeHandler) {
                        valueChangeReg = self.addValueChangeHandler(event => {
                            if (valueChange) {
                                valueChange(event);
                            }
                        });

                    }
                }
            }
        });
    }
}

export default Widget;