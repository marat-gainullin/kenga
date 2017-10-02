import Ui from 'ui/utils';
import MouseEvent from './events/mouse-event';
import WidgetEvent from './events/widget-event';
import ActionEvent from './events/action-event';
import Invoke from 'core/invoke';

class Widget {
    constructor(box, shell) {
        if (!(this instanceof Widget))
            throw 'Use new with this constructor function';
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
                foreground = aValue;
                box.style.color = foreground && foreground.toStyled ? foreground.toStyled() : foreground;
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

        function fireActionPerformed() {
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

        function addMouseDownHandler(handler) {
            return Ui.on(shell, Ui.Events.MOUSEDOWN, evt => {
                handler(new MouseEvent(self, evt));
            });
        }

        function addMouseUpHandler(handler) {
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
        Object.defineProperty(this, 'addMouseDownHandler', {
            get: function () {
                return addMouseDownHandler;
            }
        });
        Object.defineProperty(this, 'addMouseUpHandler', {
            get: function () {
                return addMouseUpHandler;
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

        Object.defineProperty(this, 'fireActionPerformed', {
            get: function () {
                return fireActionPerformed;
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

        const MOUSESTATE = {
            NULL: {},
            PRESSED: {},
            MOVED: {},
            DRAGGED: {}
        };

        let mouseState = MOUSESTATE.NULL;

        let onActionPerformed;
        let actionPerformedReg;
        Object.defineProperty(this, 'onActionPerformed', {
            get: function () {
                return onActionPerformed;
            },
            set: function (aValue) {
                if (onActionPerformed !== aValue) {
                    if (actionPerformedReg) {
                        actionPerformedReg.removeHandler();
                        actionPerformedReg = null;
                    }
                    onActionPerformed = aValue;
                    if (onActionPerformed) {
                        actionPerformedReg = self.addActionHandler(event => {
                            if (onActionPerformed) {
                                onActionPerformed(event);
                            }
                        });
                    }
                }
            }
        });

        let onMouseExited;
        let mouseOutReg;
        Object.defineProperty(this, 'onMouseExited', {
            get: function () {
                return onMouseExited;
            },
            set: function (aValue) {
                if (onMouseExited !== aValue) {
                    if (mouseOutReg) {
                        mouseOutReg.removeHandler();
                        mouseOutReg = null;
                    }
                    onMouseExited = aValue;
                    if (onMouseExited) {
                        mouseOutReg = addMouseExitHandler(evt => {
                            if (onMouseExited) {
                                evt.event.stopPropagation();
                                onMouseExited(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseClicked;
        let mouseClickedReg;
        Object.defineProperty(this, 'onMouseClicked', {
            get: function () {
                return onMouseClicked;
            },
            set: function (aValue) {
                if (onMouseClicked !== aValue) {
                    if (mouseClickedReg) {
                        mouseClickedReg.removeHandler();
                        mouseClickedReg = null;
                    }
                    onMouseClicked = aValue;
                    if (onMouseClicked) {
                        mouseClickedReg = addMouseClickHandler(evt => {
                            if (onMouseClicked) {
                                evt.event.stopPropagation();
                                onMouseClicked(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMousePressed;
        let mouseDownReg;
        Object.defineProperty(this, 'onMousePressed', {
            get: function () {
                return onMousePressed;
            },
            set: function (aValue) {
                if (onMousePressed !== aValue) {
                    if (mouseDownReg) {
                        mouseDownReg.removeHandler();
                        mouseDownReg = null;
                    }
                    onMousePressed = aValue;
                    if (onMousePressed) {
                        mouseDownReg = addMouseDownHandler(evt => {
                            if (onMousePressed) {
                                evt.event.stopPropagation();
                                onMousePressed(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseReleased;
        let mouseUpReg;
        Object.defineProperty(this, 'onMouseReleased', {
            get: function () {
                return onMouseReleased;
            },
            set: function (aValue) {
                if (onMouseReleased !== aValue) {
                    if (mouseUpReg) {
                        mouseUpReg.removeHandler();
                        mouseUpReg = null;
                    }
                    onMouseReleased = aValue;
                    if (onMouseReleased) {
                        mouseUpReg = addMouseUpHandler(evt => {
                            if (onMouseReleased) {
                                evt.event.stopPropagation();
                                onMouseReleased(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseEntered;
        let mouseOverReg;
        Object.defineProperty(this, 'onMouseEntered', {
            get: function () {
                return onMouseEntered;
            },
            set: function (aValue) {
                if (onMouseEntered !== aValue) {
                    if (mouseOverReg) {
                        mouseOverReg.removeHandler();
                        mouseOverReg = null;
                    }
                    onMouseEntered = aValue;
                    if (onMouseEntered) {
                        mouseOverReg = addMouseEnterHandler(evt => {
                            if (onMouseEntered) {
                                evt.event.stopPropagation();
                                onMouseEntered(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseWheelMoved;
        let mouseWheelReg;
        Object.defineProperty(this, 'onMouseWheelMoved', {
            get: function () {
                return onMouseWheelMoved;
            },
            set: function (aValue) {
                if (onMouseWheelMoved !== aValue) {
                    if (mouseWheelReg) {
                        mouseWheelReg.removeHandler();
                        mouseWheelReg = null;
                    }
                    onMouseWheelMoved = aValue;
                    if (onMouseWheelMoved) {
                        mouseWheelReg = addMouseWheelHandler(evt => {
                            if (onMouseWheelMoved) {
                                evt.event.stopPropagation();
                                onMouseWheelMoved(evt);
                            }
                        });
                    }
                }
            }
        });
        let onMouseMoved;
        let mouseMoveReg;
        Object.defineProperty(this, 'onMouseMoved', {
            get: function () {
                return onMouseMoved;
            },
            set: function (aValue) {
                if (onMouseMoved !== aValue) {
                    if (mouseMoveReg) {
                        mouseMoveReg.removeHandler();
                        mouseMoveReg = null;
                    }
                    onMouseMoved = aValue;
                    if (onMouseMoved) {
                        mouseMoveReg = addMouseMoveHandler(evt => {
                            if (onMouseMoved) {
                                evt.event.stopPropagation();
                                onMouseMoved(evt);
                            }
                        });
                    }
                }

            }
        });
        let onMouseDragged;
        let mouseDownForDragReg;
        let mouseUpForDragReg;
        let mouseMoveForDragReg;
        Object.defineProperty(this, 'onMouseDragged', {
            get: function () {
                return onMouseDragged;
            },
            set: function (aValue) {
                if (onMouseDragged !== aValue) {
                    if (mouseDownForDragReg) {
                        mouseDownForDragReg.removeHandler();
                        mouseDownForDragReg = null;
                    }
                    if (mouseUpForDragReg) {
                        mouseUpForDragReg.removeHandler();
                        mouseUpForDragReg = null;
                    }
                    if (mouseMoveForDragReg) {
                        mouseMoveForDragReg.removeHandler();
                        mouseMoveForDragReg = null;
                    }
                    onMouseDragged = aValue;
                    if (onMouseDragged) {
                        mouseDownForDragReg = addMouseDownHandler(evt => {
                            // TODO: Check mouse capturing capture using during dragging
                            mouseState = MOUSESTATE.PRESSED;
                            onMouseDragged(evt);
                        });
                        mouseUpForDragReg = addMouseUpHandler(evt => {
                            document.releaseCapture();
                            evt.event.stopPropagation();
                            mouseState = MOUSESTATE.NULL;
                        });
                        mouseMoveForDragReg = addMouseMoveHandler(evt => {
                            if (onMouseDragged) {
                                evt.event.stopPropagation();
                                if (mouseState === MOUSESTATE.PRESSED || mouseState === MOUSESTATE.DRAGGED) {
                                    mouseState = MOUSESTATE.DRAGGED;
                                    onMouseDragged(evt);
                                }
                            }
                        });
                    }
                }
            }
        });
        let onShown;
        let shownReg;
        Object.defineProperty(this, 'onShown', {
            get: function () {
                return onShown;
            },
            set: function (aValue) {
                if (onShown !== aValue) {
                    if (shownReg) {
                        shownReg.removeHandler();
                        shownReg = null;
                    }
                    onShown = aValue;
                    if (onShown) {
                        shownReg = addShowHandler(event => {
                            if (onShown) {
                                onShown(event);
                            }
                        });
                    }
                }
            }
        });
        let onHidden;
        let hiddenReg;
        Object.defineProperty(this, 'onHidden', {
            get: function () {
                return onHidden;
            },
            set: function (aValue) {
                if (onHidden !== aValue) {
                    if (hiddenReg) {
                        hiddenReg.removeHandler();
                        hiddenReg = null;
                    }
                    onHidden = aValue;
                    if (onHidden) {
                        hiddenReg = addHideHandler(event => {
                            if (onHidden) {
                                onHidden(event);
                            }
                        });
                    }
                }
            }
        });
        let onFocusGained;
        let focusReg;
        Object.defineProperty(this, 'onFocusGained', {
            get: function () {
                return onFocusGained;
            },
            set: function (aValue) {
                if (onFocusGained !== aValue) {
                    if (focusReg) {
                        focusReg.removeHandler();
                        focusReg = null;
                    }
                    onFocusGained = aValue;
                    if (onFocusGained && self.addFocusHandler) {
                        focusReg = self.addFocusHandler(event => {
                            if (onFocusGained) {
                                onFocusGained(event);
                            }
                        });
                    }
                }
            }
        });
        let onFocusLost;
        let blurReg;
        Object.defineProperty(this, 'onFocusLost', {
            get: function () {
                return onFocusLost;
            },
            set: function (aValue) {
                if (onFocusLost !== aValue) {
                    if (blurReg) {
                        blurReg.removeHandler();
                        blurReg = null;
                    }
                    onFocusLost = aValue;
                    if (onFocusLost && self.addBlurHandler) {
                        blurReg = self.addBlurHandler(event => {
                            if (onFocusLost) {
                                onFocusLost(event);
                            }
                            mouseState = MOUSESTATE.NULL;
                        });
                    }
                }
            }
        });
        let onKeyTyped;
        let keyTypedReg;
        Object.defineProperty(this, 'onKeyTyped', {
            get: function () {
                return onKeyTyped;
            },
            set: function (aValue) {
                if (onKeyTyped !== aValue) {
                    if (keyTypedReg) {
                        keyTypedReg.removeHandler();
                        keyTypedReg = null;
                    }
                    onKeyTyped = aValue;
                    if (onKeyTyped && self.addKeyPressHandler) {
                        keyTypedReg = self.addKeyPressHandler(event => {
                            if (onKeyTyped) {
                                event.event.stopPropagation();
                                onKeyTyped(event);
                            }
                        });
                    }
                }
            }
        });
        let onKeyPressed;
        let keyDownReg;
        Object.defineProperty(this, 'onKeyPressed', {
            get: function () {
                return onKeyPressed;
            },
            set: function (aValue) {
                if (onKeyPressed !== aValue) {
                    if (keyDownReg) {
                        keyDownReg.removeHandler();
                        keyDownReg = null;
                    }
                    onKeyPressed = aValue;
                    if (onKeyPressed && self.addKeyDownHandler) {
                        keyDownReg = self.addKeyDownHandler(event => {
                            if (onKeyPressed) {
                                event.getEvent().stopPropagation();
                                onKeyPressed(event);
                            }
                        });
                    }
                }
            }
        });
        let onKeyReleased;
        let keyUpReg;
        Object.defineProperty(this, 'onKeyReleased', {
            get: function () {
                return onKeyReleased;
            },
            set: function (aValue) {
                if (onKeyReleased !== aValue) {
                    if (keyUpReg) {
                        keyUpReg.removeHandler();
                        keyUpReg = null;
                    }
                    onKeyReleased = aValue;
                    if (onKeyReleased && self.addKeyUpHandler) {
                        keyUpReg = self.addKeyUpHandler(event => {
                            if (onKeyReleased) {
                                event.event.stopPropagation();
                                onKeyReleased(event);
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