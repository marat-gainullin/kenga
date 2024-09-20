import Event from '../event';

class BlurEvent extends Event {
    constructor(w, event) {
        super(w, w, event);
    }
}

export default BlurEvent;