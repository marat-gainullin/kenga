import Event from '../event';

class KeyEvent extends Event {
    constructor(w, event) {
        super(w, event.target, event);
        Object.defineProperty(this, 'altDown', {
            get: function() {
                return event.altKey;
            }
        });
        Object.defineProperty(this, 'controlDown', {
            get: function() {
                return event.ctrlKey;
            }
        });
        Object.defineProperty(this, 'shiftDown', {
            get: function() {
                return event.shiftKey;
            }
        });
        Object.defineProperty(this, 'metaDown', {
            get: function() {
                return event.metaKey;
            }
        });
        Object.defineProperty(this, 'key', {
            get: function() {
                return event.keyCode || 0;
            }
        });
        Object.defineProperty(this, 'char', {
            get: function() {
                return event.charCode || 0;
            }
        });
    }
}

export default KeyEvent;
