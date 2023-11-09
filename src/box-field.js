import Ui from './utils';
import Widget from './widget';
import ValueChangeEvent from './events/value-change-event';
import TextChangeEvent from './events/text-change-event';
import FocusEvent from './events/focus-event';
import BlurEvent from './events/blur-event';
import KeyEvent from "./events/key-event";

class BoxField extends Widget {
    constructor(box, shell) {
        if (!box) {
            box = document.createElement('input');
            box.type = 'text';
        }
        if (!shell) {
            shell = box;
        }

        super(box, shell);
        this.focusable = true;
        const self = this;

        /**
         * The text to be shown when component's value is absent.
         */
        Object.defineProperty(this, 'emptyText', {
            configurable: true,
            get: function () {
                return box.placeholder;
            },
            set: function (aValue) {
                box.placeholder = aValue == null ? '' : aValue;
            }
        });

        function checkValidity() {
            return box.checkValidity();
        }

        this.checkValidity = checkValidity;

        function formatError() {
            return box.validationMessage;
        }

        this.formatError = formatError;

        function validate() {
            if (self.checkValidity) {
                if (self.checkValidity()) {
                    shell.classList.remove('p-invalid')
                    if (self.hideError) {
                        self.hideError();
                    }
                } else {
                    shell.classList.add('p-invalid')
                    const message = self.error ? self.error : (self.formatError ? self.formatError() : null)
                    if (message && self.showError) {
                        self.showError(message);
                    }
                }
            }
        }

        this.validate = validate;

        this.validateOnInput = true;

        const changeReg = Ui.on(box, Ui.Events.CHANGE, evt => {
            if (self.textChanged) {
                self.textChanged();
            }
            if (self.validate) {
              self.validate();
            }
        });

        const enterReg = Ui.on(box, Ui.Events.KEYPRESS, evt => {
            if (evt.key.toLowerCase() === 'enter') {
                self.fireAction();
            }
        });

        const inputReg = Ui.on(box, Ui.Events.INPUT, evt => {
            fireTextChanged(box.value)
            if (self.validateOnInput) {
              if (self.textChanged) {
                self.textChanged();
              }
              if (self.validate) {
                self.validate();
              }
            }
        });

        function hideError() {
            if (errorPopup && errorPopup.parentNode)
                errorPopup.parentNode.removeChild(errorPopup);
            errorPopup = null;
        }

        this.hideError = hideError;

        let errorPopup = null;

        function showError(errorText) {
            if (errorPopup == null) {
                errorPopup = document.createElement('div');
                errorPopup.className = 'p-error-popup';
                errorPopup.innerText = errorText;
                if (shell === box) {
                    const left = Ui.absoluteLeft(box);
                    const top = Ui.absoluteTop(box);
                    errorPopup.style.left = `${left}px`;
                    errorPopup.style.top = `${top}px`;
                    document.body.appendChild(errorPopup);
                    errorPopup.style.top = `${top + box.offsetHeight}px`;
                } else {
                    shell.appendChild(errorPopup);
                }
                Ui.later(() => {
                    if (errorPopup) {
                        errorPopup.classList.add('p-error-popup-shown');
                    }
                });
            } else {
                errorPopup.innerText = errorText;
            }
            return errorPopup;
        }

        this.showError = showError;

        Object.defineProperty(this, 'valid', {
            get: function () {
                return self.checkValidity ? self.checkValidity() : box.checkValidity;
            }
        });

        const textChangeHandlers = new Set();

        function addTextChangeHandler(handler) {
            textChangeHandlers.add(handler);
            return {
                removeHandler: function () {
                    textChangeHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addTextChangeHandler', {
            get: function () {
                return addTextChangeHandler;
            }
        });

        function fireTextChanged(aValue) {
            const event = new TextChangeEvent(self, aValue);
            textChangeHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        Object.defineProperty(this, 'fireTextChanged', {
            get: function () {
                return fireTextChanged;
            }
        });
        let onTextChange;
        let onTextChangeReg;
        Object.defineProperty(this, 'onTextChange', {
            get: function () {
                return onTextChange;
            },
            set: function (aValue) {
                if (onTextChange !== aValue) {
                    if (onTextChangeReg) {
                        onTextChangeReg.removeHandler();
                        onTextChangeReg = null;
                    }
                    onTextChange = aValue;
                    if (onTextChange && addTextChangeHandler) {
                        onTextChangeReg = addTextChangeHandler(event => {
                            if (onTextChange) {
                                onTextChange(event);
                            }
                        });

                    }
                }
            }
        });

        const valueChangeHandlers = new Set();

        function addValueChangeHandler(handler) {
            valueChangeHandlers.add(handler);
            return {
                removeHandler: function () {
                    valueChangeHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addValueChangeHandler', {
            get: function () {
                return addValueChangeHandler;
            }
        });

        function fireValueChanged(oldValue) {
            if (self.validate) {
              self.validate()
            }
            const event = new ValueChangeEvent(self, oldValue, self.value);
            valueChangeHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        Object.defineProperty(this, 'fireValueChanged', {
            get: function () {
                return fireValueChanged;
            }
        });
        const focusHandlers = new Set();

        function addFocusHandler(handler) {
            focusHandlers.add(handler);
            return {
                removeHandler: function () {
                    focusHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addFocusHandler', {
            get: function () {
                return addFocusHandler;
            }
        });

        Ui.on(box, Ui.Events.FOCUS, fireFocus);

        function fireFocus() {
            const event = new FocusEvent(self);
            focusHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const focusLostHandlers = new Set();

        function addFocusLostHandler(handler) {
            focusLostHandlers.add(handler);
            return {
                removeHandler: function () {
                    focusLostHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addFocusLostHandler', {
            get: function () {
                return addFocusLostHandler;
            }
        });

        Ui.on(box, Ui.Events.BLUR, fireBlur);

        function fireBlur() {
            const event = new BlurEvent(self);
            focusLostHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        function addKeyTypeHandler(handler) {
            return Ui.on(box, Ui.Events.KEYPRESS, evt => {
                handler(new KeyEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addKeyTypeHandler', {
            configurable: true,
            get: function () {
                return addKeyTypeHandler;
            }
        });

        function addKeyPressHandler(handler) {
            return Ui.on(box, Ui.Events.KEYDOWN, evt => {
                handler(new KeyEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addKeyPressHandler', {
            configurable: true,
            get: function () {
                return addKeyPressHandler;
            }
        });

        function addKeyReleaseHandler(handler) {
            return Ui.on(box, Ui.Events.KEYUP, evt => {
                handler(new KeyEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addKeyReleaseHandler', {
            configurable: true,
            get: function () {
                return addKeyReleaseHandler;
            }
        });
    }
}

export default BoxField;
