import Event from '../event';

class WidgetEvent extends Event {
    constructor(w) {
        super(w, w);
    }
}

export default WidgetEvent;