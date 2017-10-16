import Ui from './utils';
import Invoke from 'septima-utils/invoke';
import Widget from './widget';
import ValueChangeEvent from './events/value-change-event';
import FocusEvent from './events/focus-event';
import BlurEvent from './events/blur-event';
const ERROR_BUBBLE_OFFSET_PART = 0.2;

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
        Object.defineProperty(this, "emptyText", {
            configurable: true,
            get: function() {
                return box.placeholder;
            },
            set: function(aValue) {
                box.placeholder = aValue;
            }
        });

        const changeReg = Ui.on(box, Ui.Events.CHANGE, evt => {
            self.fireAction();
            box.checkValidity();
            if (self.error)
                showError();
            else
                self.textChanged();
        });

        const inputReg = Ui.on(box, Ui.Events.INPUT, evt => {
            self.error = null;
        });

        function hideError() {
            if (errorPopup && errorPopup.parentNode)
                document.body.removeChild(errorPopup);
            errorPopup = null;
        }
        this.hideError = hideError;

        var errorPopup = null;

        function showError() {
            hideError();
            errorPopup = document.createElement('div');
            errorPopup.className = 'p-error-popup';
            errorPopup.innerText = self.error;
            const left = Ui.absoluteLeft(box);
            const top = Ui.absoluteTop(box);
            errorPopup.style.left = `${left + box.offsetWidth / 2}px`;
            errorPopup.style.top = `${top + box.offsetHeight}px`;
            document.body.appendChild(errorPopup);
            errorPopup.style.left = `${errorPopup.offsetLeft - errorPopup.offsetWidth * ERROR_BUBBLE_OFFSET_PART}px`;
        }

        this.showError = showError;

        const valueChangeHandlers = new Set();

        function addValueChangeHandler(handler) {
            valueChangeHandlers.add(handler);
            return {
                removeHandler: function() {
                    valueChangeHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addValueChangeHandler', {
            get: function() {
                return addValueChangeHandler;
            }
        });

        function fireValueChanged(oldValue) {
            const event = new ValueChangeEvent(self, oldValue, self.value);
            valueChangeHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }
        Object.defineProperty(this, 'fireValueChanged', {
            get: function() {
                return fireValueChanged;
            }
        });
        const focusHandlers = new Set();

        function addFocusHandler(handler) {
            focusHandlers.add(handler);
            return {
                removeHandler: function() {
                    focusHandlers.delete(handler);
                }
            };
        }
        Object.defineProperty(this, 'addFocusHandler', {
            get: function() {
                return addFocusHandler;
            }
        });

        Ui.on(box, Ui.Events.FOCUS, fireFocus);

        function fireFocus() {
            const event = new FocusEvent(self);
            focusHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }

        const focusLostHandlers = new Set();

        function addFocusLostHandler(handler) {
            focusLostHandlers.add(handler);
            return {
                removeHandler: function() {
                    focusLostHandlers.delete(handler);
                }
            };
        }
        Object.defineProperty(this, 'addFocusLostHandler', {
            get: function() {
                return addFocusLostHandler;
            }
        });

        Ui.on(box, Ui.Events.BLUR, fireBlur);

        function fireBlur() {
            const event = new BlurEvent(self);
            focusLostHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }
    }
}

export default BoxField;
       