import Event from '../event';

class ActionEvent extends Event {
    constructor(w) {
        super(w, w);
    }
}

export default ActionEvent;