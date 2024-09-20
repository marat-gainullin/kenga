import Ui from './utils';

function Decorator() {
    const self = this;

    this.element.classList.add('p-decorator');

    let nullable = true;
    let onValueSelect = null;

    const btnClear = document.createElement('div');
    btnClear.className = 'p-decoration p-clear';
    btnClear.tabIndex = '1'
    Ui.on(btnClear, Ui.Events.CLICK, evt => {
        evt.stopPropagation();
        self.value = null;
        self.focus();
    });

    const btnSelect = document.createElement('div');
    btnSelect.tabIndex = '1'
    btnSelect.className = 'p-decoration p-select';
    Ui.on(btnSelect, Ui.Events.CLICK, evt => {
        evt.stopPropagation();
        onValueSelect.call(self, self);
    });

    function redecorate() {
        self.element.classList.remove('p-decorator-nullable-selectable');
        self.element.classList.remove('p-decorator-nullable');
        self.element.classList.remove('p-decorator-selectable');
        if (btnClear.parentNode === self.element)
            self.element.removeChild(btnClear);
        if (btnSelect.parentNode === self.element)
            self.element.removeChild(btnSelect);
        if (nullable && onValueSelect) {
            self.element.classList.add('p-decorator-nullable-selectable');
            self.element.appendChild(btnClear);
            self.element.appendChild(btnSelect);
        } else if (nullable) {
            self.element.classList.add('p-decorator-nullable');
            self.element.appendChild(btnClear);
        } else if (onValueSelect) {
            self.element.classList.add('p-decorator-selectable');
            self.element.appendChild(btnSelect);
        }
    }
    redecorate();

    Object.defineProperty(this, 'nullable', {
        get: function() {
            return nullable;
        },
        set: function(aValue) {
            if (nullable !== aValue) {
                nullable = aValue;
                redecorate();
            }
        }
    });
    Object.defineProperty(this, 'onValueSelect', {
        get: function() {
            return onValueSelect;
        },
        set: function(aValue) {
            if (onValueSelect !== aValue) {
                onValueSelect = aValue;
                redecorate();
            }
        }
    });

    Object.defineProperty(this, 'selector', {
        get: function() {
            return btnSelect;
        }
    });

    Object.defineProperty(this, 'clearer', {
        get: function() {
            return btnClear;
        }
    });
}
export default Decorator;