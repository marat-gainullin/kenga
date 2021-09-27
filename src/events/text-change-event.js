import Event from '../event';

class TextChangeEvent extends Event {
    constructor(w, aValue) {
        super(w, w);
        Object.defineProperty(this, 'value', {
            get: function() {
                return aValue;
            }
        });
    }
}

export default TextChangeEvent;