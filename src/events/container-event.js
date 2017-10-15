import Event from '../event';

class ContainerEvent extends Event {
    constructor(container, child) {
        super(container, child);
        Object.defineProperty(this, 'child', {
            get: function() {
                return child;
            }
        });
    }
}

export default ContainerEvent;