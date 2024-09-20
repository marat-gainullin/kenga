import Event from '../event';

class FocusEvent extends Event {
    constructor(w, event) {
        super(w, w, event);
    }
}

export default FocusEvent;