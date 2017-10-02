import Event from '../event';

class FocusEvent extends Event {
    constructor(w) {
        super(w, w);
    }
}

export default FocusEvent;