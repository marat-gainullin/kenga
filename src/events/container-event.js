import Event from '../event';

class ContainerEvent extends Event {
    constructor(aContainer, aChild) {
        super(aContainer, aChild);
        Object.defineProperty(this, 'child', {
            get: function() {
                return aChild;
            }
        });
    }
}

export default ContainerEvent;