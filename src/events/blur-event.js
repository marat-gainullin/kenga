import Event from '../event';

class BlurEvent extends Event {
    constructor(w) {
        super(w, w);
    }
}

export default BlurEvent;